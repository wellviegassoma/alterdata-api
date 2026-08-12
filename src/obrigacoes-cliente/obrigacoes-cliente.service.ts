import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObrigacaoClienteDto } from './dto/create-obrigacao-cliente.dto';
import { UpdateObrigacaoClienteDto } from './dto/update-obrigacao-cliente.dto';
import { GerarObrigacoesDto } from './dto/gerar-obrigacoes.dto';

const INCLUDE = {
  tipoObrigacao: true,
  cliente: {
    select: { id: true, cnpjCpf: true, nome: true, nomeFantasia: true, codigo: true },
  },
} as const;

export type StatusObrigacao = 'VENCIDO' | 'VENCENDO' | 'OK' | 'CUMPRIDA';

function inicioDoDia(data: Date): Date {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diasAteVencimento(dataVencimento: Date): number {
  const hoje = inicioDoDia(new Date());
  const venc = inicioDoDia(dataVencimento);
  return Math.round((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function statusDe(cumprida: boolean, dataVencimento: Date, diasAlerta: number): StatusObrigacao {
  if (cumprida) return 'CUMPRIDA';
  const dias = diasAteVencimento(dataVencimento);
  if (dias < 0) return 'VENCIDO';
  if (dias <= diasAlerta) return 'VENCENDO';
  return 'OK';
}

/** Anexa status/diasRestantes calculados a partir de hoje — não fica salvo no banco. */
function comStatus<T extends { dataVencimento: Date; cumprida: boolean }>(
  obrigacao: T,
  diasAlerta: number,
) {
  return {
    ...obrigacao,
    status: statusDe(obrigacao.cumprida, obrigacao.dataVencimento, diasAlerta),
    diasRestantes: diasAteVencimento(obrigacao.dataVencimento),
  };
}

@Injectable()
export class ObrigacoesClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateObrigacaoClienteDto) {
    const obrigacao = await this.prisma.obrigacaoCliente.create({
      data: {
        clienteId: dto.clienteId,
        tipoObrigacaoId: dto.tipoObrigacaoId,
        competencia: dto.competencia,
        dataVencimento: new Date(dto.dataVencimento),
        observacoes: dto.observacoes,
      },
      include: INCLUDE,
    });
    return comStatus(obrigacao, 30);
  }

  async listar(params?: { clienteId?: string; diasAlerta?: number }) {
    const obrigacoes = await this.prisma.obrigacaoCliente.findMany({
      where: params?.clienteId ? { clienteId: params.clienteId } : undefined,
      orderBy: { dataVencimento: 'asc' },
      include: INCLUDE,
    });
    return obrigacoes.map((o) => comStatus(o, params?.diasAlerta ?? 30));
  }

  /** Não cumpridas, vencidas ou vencendo nos próximos `diasAlerta` dias — pra tela inicial. */
  async alertas(diasAlerta = 30) {
    const limite = new Date();
    limite.setDate(limite.getDate() + diasAlerta);
    limite.setHours(23, 59, 59, 999);

    const obrigacoes = await this.prisma.obrigacaoCliente.findMany({
      where: { cumprida: false, dataVencimento: { lte: limite } },
      orderBy: { dataVencimento: 'asc' },
      include: INCLUDE,
    });

    return obrigacoes.map((o) => comStatus(o, diasAlerta));
  }

  async atualizar(id: string, dto: UpdateObrigacaoClienteDto) {
    const existente = await this.prisma.obrigacaoCliente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException(`Obrigação ${id} não encontrada.`);
    }
    const obrigacao = await this.prisma.obrigacaoCliente.update({
      where: { id },
      data: {
        dataVencimento: dto.dataVencimento ? new Date(dto.dataVencimento) : undefined,
        observacoes: dto.observacoes,
        cumprida: dto.cumprida,
        cumpridaEm: dto.cumprida === undefined ? undefined : dto.cumprida ? new Date() : null,
      },
      include: INCLUDE,
    });
    return comStatus(obrigacao, 30);
  }

  async remover(id: string) {
    const existente = await this.prisma.obrigacaoCliente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException(`Obrigação ${id} não encontrada.`);
    }
    await this.prisma.obrigacaoCliente.delete({ where: { id } });
  }

  /**
   * Gera em lote as obrigações da competência informada: para cada tipo ativo aplicável
   * (mensal sempre, anual só se o mês bater) e cada cliente ativo cujo regime tributário se
   * encaixa, cria a instância se ainda não existir (índice único evita duplicata).
   */
  async gerar(dto: GerarObrigacoesDto) {
    const [ano, mes] = dto.competencia.split('-').map(Number);

    const tipos = await this.prisma.tipoObrigacaoFiscal.findMany({ where: { ativo: true } });
    const aplicaveis = tipos.filter(
      (t) => t.periodicidade === 'MENSAL' || t.mesVencimento === mes,
    );

    if (aplicaveis.length === 0) {
      return { criadas: 0, jaExistiam: 0, competencia: dto.competencia };
    }

    const clientes = await this.prisma.cliente.findMany({
      where: { status: 'ATIVO' },
      select: { id: true, dadosFiscais: { select: { regimeTributario: true } } },
    });

    const candidatos: {
      clienteId: string;
      tipoObrigacaoId: string;
      competencia: string;
      dataVencimento: Date;
    }[] = [];

    for (const tipo of aplicaveis) {
      const competenciaChave = tipo.periodicidade === 'MENSAL' ? dto.competencia : String(ano);
      const dataVencimento =
        tipo.periodicidade === 'MENSAL'
          ? new Date(ano, mes - 1, tipo.diaVencimento)
          : new Date(ano, (tipo.mesVencimento ?? mes) - 1, tipo.diaVencimento);

      for (const cliente of clientes) {
        const regime = cliente.dadosFiscais?.regimeTributario;
        const aplicaAoCliente =
          tipo.regimesAplicaveis.length === 0 || (regime && tipo.regimesAplicaveis.includes(regime));
        if (!aplicaAoCliente) continue;

        candidatos.push({
          clienteId: cliente.id,
          tipoObrigacaoId: tipo.id,
          competencia: competenciaChave,
          dataVencimento,
        });
      }
    }

    const resultado = await this.prisma.obrigacaoCliente.createMany({
      data: candidatos,
      skipDuplicates: true,
    });

    return {
      criadas: resultado.count,
      jaExistiam: candidatos.length - resultado.count,
      competencia: dto.competencia,
    };
  }
}
