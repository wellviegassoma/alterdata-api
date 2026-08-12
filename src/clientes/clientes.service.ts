import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmpresasService } from '../alterdata/empresas/empresas.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

const INCLUDE_COMPLETO = {
  contatos: true,
  endereco: true,
  dadosFiscais: true,
  contrato: true,
  tags: { include: { tag: true } },
  responsavelFiscal: { select: { id: true, nome: true, email: true, papel: true } },
  responsavelContabil: { select: { id: true, nome: true, email: true, papel: true } },
  responsavelDp: { select: { id: true, nome: true, email: true, papel: true } },
} as const;

const SELECT_BASE = {
  id: true,
  cnpjCpf: true,
  alterdataEmpresaId: true,
} as const;

interface EmpresaAtivaResumo {
  id: string;
  nome: string;
  cpfCnpjAlfanumerico: string;
}

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly empresasService: EmpresasService,
  ) {}

  private montarDadosFiscais(dto: CreateClienteDto['dadosFiscais']) {
    if (!dto) return undefined;
    return {
      ...dto,
      dataAbertura: dto.dataAbertura ? new Date(dto.dataAbertura) : undefined,
    };
  }

  private montarContrato(dto: CreateClienteDto['contrato']) {
    if (!dto) return undefined;
    return {
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : undefined,
    };
  }

  async criar(dto: CreateClienteDto) {
    const existente = await this.prisma.cliente.findUnique({ where: { cnpjCpf: dto.cnpjCpf } });
    if (existente) {
      throw new ConflictException(`Já existe um cliente cadastrado com cnpjCpf ${dto.cnpjCpf}.`);
    }

    return this.prisma.cliente.create({
      data: {
        cnpjCpf: dto.cnpjCpf,
        alterdataEmpresaId: dto.alterdataEmpresaId,
        nome: dto.nome,
        nomeFantasia: dto.nomeFantasia,
        codigo: dto.codigo,
        status: dto.status,
        observacoes: dto.observacoes,
        responsavelFiscalId: dto.responsavelFiscalId,
        responsavelContabilId: dto.responsavelContabilId,
        responsavelDpId: dto.responsavelDpId,
        endereco: dto.endereco ? { create: dto.endereco } : undefined,
        dadosFiscais: dto.dadosFiscais ? { create: this.montarDadosFiscais(dto.dadosFiscais) } : undefined,
        contrato: dto.contrato ? { create: this.montarContrato(dto.contrato) } : undefined,
        contatos: dto.contatos?.length ? { create: dto.contatos } : undefined,
        tags: dto.tags?.length
          ? {
              create: dto.tags.map((nome) => ({
                tag: { connectOrCreate: { where: { nome }, create: { nome } } },
              })),
            }
          : undefined,
      },
      include: INCLUDE_COMPLETO,
    });
  }

  listar(params?: { skip?: number; take?: number; status?: string }) {
    return this.prisma.cliente.findMany({
      where: params?.status ? { status: params.status as never } : undefined,
      skip: params?.skip,
      take: params?.take ?? 50,
      orderBy: [{ codigo: { sort: 'asc', nulls: 'last' } }, { nome: 'asc' }],
      include: INCLUDE_COMPLETO,
    });
  }

  async buscarLocalOuFalhar(cnpjCpf: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { cnpjCpf },
      include: INCLUDE_COMPLETO,
    });
    if (!cliente) {
      throw new NotFoundException(`Nenhum cliente local encontrado com cnpjCpf ${cnpjCpf}.`);
    }
    return cliente;
  }

  async atualizar(cnpjCpf: string, dto: UpdateClienteDto) {
    await this.buscarLocalOuFalhar(cnpjCpf);

    const dadosFiscais = this.montarDadosFiscais(dto.dadosFiscais);
    const contrato = this.montarContrato(dto.contrato);

    return this.prisma.cliente.update({
      where: { cnpjCpf },
      data: {
        alterdataEmpresaId: dto.alterdataEmpresaId,
        nome: dto.nome,
        nomeFantasia: dto.nomeFantasia,
        codigo: dto.codigo,
        status: dto.status,
        observacoes: dto.observacoes,
        responsavelFiscalId: dto.responsavelFiscalId,
        responsavelContabilId: dto.responsavelContabilId,
        responsavelDpId: dto.responsavelDpId,
        endereco: dto.endereco
          ? { upsert: { create: dto.endereco, update: dto.endereco } }
          : undefined,
        dadosFiscais: dadosFiscais
          ? { upsert: { create: dadosFiscais, update: dadosFiscais } }
          : undefined,
        contrato: contrato ? { upsert: { create: contrato, update: contrato } } : undefined,
        // Contatos e tags são substituídos por completo quando enviados,
        // para manter a semântica simples (o cliente da API manda a lista final).
        contatos: dto.contatos
          ? { deleteMany: {}, create: dto.contatos }
          : undefined,
        tags: dto.tags
          ? {
              deleteMany: {},
              create: dto.tags.map((nome) => ({
                tag: { connectOrCreate: { where: { nome }, create: { nome } } },
              })),
            }
          : undefined,
      },
      include: INCLUDE_COMPLETO,
    });
  }

  async remover(cnpjCpf: string) {
    await this.buscarLocalOuFalhar(cnpjCpf);
    await this.prisma.cliente.delete({ where: { cnpjCpf } });
  }

  /**
   * Visão consolidada: dados cadastrais do eContador (via Alterdata) +
   * dados locais (contato, endereço, contrato, responsáveis por setor, tags).
   * Se o cliente local ainda não tiver alterdataEmpresaId, tenta um fallback
   * mais limitado usando a consulta simplificada por CNPJ.
   */
  async buscarCompleto(cnpjCpf: string) {
    const local = await this.buscarLocalOuFalhar(cnpjCpf);

    let econtador: Record<string, unknown> | null = null;
    if (local.alterdataEmpresaId) {
      econtador = await this.empresasService.buscarCompletaPorId(local.alterdataEmpresaId);
    } else {
      const simplificada = await this.empresasService.buscarSimplificadaPorId(cnpjCpf).catch(() => null);
      const attrs =
        simplificada && !Array.isArray(simplificada.data) ? simplificada.data?.attributes : undefined;
      econtador = attrs ? { ...attrs } : null;
    }

    return {
      econtador,
      local,
    };
  }

  /**
   * Importa/sincroniza como Cliente local toda empresa marcada como ativa no
   * eContador: cria quem ainda não existir (dedupe por cnpjCpf) e completa
   * nome/nomeFantasia/código/endereço de quem já existir mas ainda não tiver
   * esses dados preenchidos. O resto do cadastro (contato, dados fiscais,
   * contrato) continua manual — a Alterdata não expõe isso pelo ePlugin.
   */
  async importarAtivos() {
    const empresas = (await this.buscarTodasEmpresasAtivas()).filter((e) =>
      Boolean(e.cpfCnpjAlfanumerico),
    );

    const existentes = await this.prisma.cliente.findMany({
      where: { cnpjCpf: { in: empresas.map((e) => e.cpfCnpjAlfanumerico) } },
      select: { ...SELECT_BASE, nome: true, nomeFantasia: true, codigo: true, endereco: true },
    });
    const existentesPorCnpj = new Map(existentes.map((c) => [c.cnpjCpf, c]));

    let criados = 0;
    let enriquecidos = 0;

    const CONCORRENCIA = 8;
    for (let i = 0; i < empresas.length; i += CONCORRENCIA) {
      const lote = empresas.slice(i, i + CONCORRENCIA);
      await Promise.all(
        lote.map(async (empresa) => {
          try {
            const resultado = await this.importarOuEnriquecerUm(
              empresa,
              existentesPorCnpj.get(empresa.cpfCnpjAlfanumerico),
            );
            if (resultado === 'criado') criados += 1;
            if (resultado === 'enriquecido') enriquecidos += 1;
          } catch (error) {
            this.logger.warn(
              `Falha ao importar/enriquecer ${empresa.cpfCnpjAlfanumerico}: ${(error as Error).message}`,
            );
          }
        }),
      );
    }

    return {
      totalAtivasNoEcontador: empresas.length,
      importados: criados,
      enriquecidos,
      jaCompletos: empresas.length - criados - enriquecidos,
    };
  }

  private async importarOuEnriquecerUm(
    empresa: EmpresaAtivaResumo,
    existente:
      | {
          id: string;
          cnpjCpf: string;
          alterdataEmpresaId: string | null;
          nome: string | null;
          nomeFantasia: string | null;
          codigo: string | null;
          endereco: { id: string } | null;
        }
      | undefined,
  ): Promise<'criado' | 'enriquecido' | 'sem-mudanca'> {
    // buscarCompletaPorId já mescla dp.pack (endereço) + identificacao
    // (nomeFantasia/código) numa única visão, evitando chamadas redundantes.
    const completa = empresa.id
      ? await this.empresasService.buscarCompletaPorId(empresa.id).catch(() => null)
      : null;
    const detalhe = completa as { nomeFantasia?: string; codigo?: string } | null;
    const enderecoEcontador = (completa?.endereco as string | undefined) ?? undefined;

    if (!existente) {
      await this.prisma.cliente.create({
        data: {
          cnpjCpf: empresa.cpfCnpjAlfanumerico,
          alterdataEmpresaId: empresa.id,
          nome: empresa.nome,
          nomeFantasia: detalhe?.nomeFantasia,
          codigo: detalhe?.codigo,
          status: 'ATIVO',
          endereco: enderecoEcontador ? { create: { rua: enderecoEcontador } } : undefined,
        },
      });
      return 'criado';
    }

    const atualizacao: Record<string, unknown> = {};
    if (!existente.alterdataEmpresaId && empresa.id) atualizacao.alterdataEmpresaId = empresa.id;
    if (!existente.nome && empresa.nome) atualizacao.nome = empresa.nome;
    if (!existente.nomeFantasia && detalhe?.nomeFantasia) atualizacao.nomeFantasia = detalhe.nomeFantasia;
    if (!existente.codigo && detalhe?.codigo) atualizacao.codigo = detalhe.codigo;

    const precisaEndereco = !existente.endereco && enderecoEcontador;

    if (Object.keys(atualizacao).length === 0 && !precisaEndereco) {
      return 'sem-mudanca';
    }

    await this.prisma.cliente.update({
      where: { id: existente.id },
      data: {
        ...atualizacao,
        endereco: precisaEndereco ? { create: { rua: enderecoEcontador } } : undefined,
      },
    });
    return 'enriquecido';
  }

  private async buscarTodasEmpresasAtivas(): Promise<EmpresaAtivaResumo[]> {
    const limit = 100;
    let offset = 0;
    const todas: EmpresaAtivaResumo[] = [];

    for (;;) {
      const pagina = await this.empresasService.listar({ ativa: true, offset, limit });
      const items = Array.isArray(pagina.data) ? pagina.data : pagina.data ? [pagina.data] : [];

      for (const item of items) {
        todas.push({
          id: item.id ?? '',
          nome: item.attributes?.nome ?? '',
          cpfCnpjAlfanumerico: item.attributes?.cpfCnpjAlfanumerico ?? '',
        });
      }

      if (items.length < limit) break;
      offset += limit;
    }

    return todas;
  }
}
