import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
  responsavelInterno: { select: { id: true, nome: true, email: true, papel: true } },
} as const;

@Injectable()
export class ClientesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly empresasService: EmpresasService,
  ) {}

  async criar(dto: CreateClienteDto) {
    const existente = await this.prisma.cliente.findUnique({ where: { cnpjCpf: dto.cnpjCpf } });
    if (existente) {
      throw new ConflictException(`Já existe um cliente cadastrado com cnpjCpf ${dto.cnpjCpf}.`);
    }

    return this.prisma.cliente.create({
      data: {
        cnpjCpf: dto.cnpjCpf,
        alterdataEmpresaId: dto.alterdataEmpresaId,
        status: dto.status,
        observacoes: dto.observacoes,
        responsavelInternoId: dto.responsavelInternoId,
        endereco: dto.endereco ? { create: dto.endereco } : undefined,
        dadosFiscais: dto.dadosFiscais ? { create: dto.dadosFiscais } : undefined,
        contrato: dto.contrato
          ? {
              create: {
                ...dto.contrato,
                dataInicio: dto.contrato.dataInicio ? new Date(dto.contrato.dataInicio) : undefined,
              },
            }
          : undefined,
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
      orderBy: { createdAt: 'desc' },
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

    return this.prisma.cliente.update({
      where: { cnpjCpf },
      data: {
        alterdataEmpresaId: dto.alterdataEmpresaId,
        status: dto.status,
        observacoes: dto.observacoes,
        responsavelInternoId: dto.responsavelInternoId,
        endereco: dto.endereco
          ? { upsert: { create: dto.endereco, update: dto.endereco } }
          : undefined,
        dadosFiscais: dto.dadosFiscais
          ? { upsert: { create: dto.dadosFiscais, update: dto.dadosFiscais } }
          : undefined,
        contrato: dto.contrato
          ? {
              upsert: {
                create: {
                  ...dto.contrato,
                  dataInicio: dto.contrato.dataInicio ? new Date(dto.contrato.dataInicio) : undefined,
                },
                update: {
                  ...dto.contrato,
                  dataInicio: dto.contrato.dataInicio ? new Date(dto.contrato.dataInicio) : undefined,
                },
              },
            }
          : undefined,
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
   * dados locais (contato, endereço, contrato, responsável interno, tags).
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
}
