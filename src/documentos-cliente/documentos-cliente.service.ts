import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentoClienteDto } from './dto/create-documento-cliente.dto';
import { UpdateDocumentoClienteDto } from './dto/update-documento-cliente.dto';

const INCLUDE = {
  tipoDocumento: true,
  cliente: {
    select: { id: true, cnpjCpf: true, nome: true, nomeFantasia: true, codigo: true },
  },
} as const;

export type StatusVencimento = 'VENCIDO' | 'VENCENDO' | 'OK';

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

function statusDe(dataVencimento: Date, diasAlerta: number): StatusVencimento {
  const dias = diasAteVencimento(dataVencimento);
  if (dias < 0) return 'VENCIDO';
  if (dias <= diasAlerta) return 'VENCENDO';
  return 'OK';
}

/** Anexa status/diasRestantes calculados a partir de hoje — não fica salvo no banco, evita ficar desatualizado. */
function comStatus<T extends { dataVencimento: Date }>(doc: T, diasAlerta: number) {
  return {
    ...doc,
    status: statusDe(doc.dataVencimento, diasAlerta),
    diasRestantes: diasAteVencimento(doc.dataVencimento),
  };
}

@Injectable()
export class DocumentosClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateDocumentoClienteDto) {
    const doc = await this.prisma.documentoCliente.create({
      data: {
        clienteId: dto.clienteId,
        tipoDocumentoId: dto.tipoDocumentoId,
        dataEmissao: dto.dataEmissao ? new Date(dto.dataEmissao) : undefined,
        dataVencimento: new Date(dto.dataVencimento),
        observacoes: dto.observacoes,
      },
      include: INCLUDE,
    });
    return comStatus(doc, 30);
  }

  async listar(params?: { clienteId?: string; diasAlerta?: number }) {
    const docs = await this.prisma.documentoCliente.findMany({
      where: params?.clienteId ? { clienteId: params.clienteId } : undefined,
      orderBy: { dataVencimento: 'asc' },
      include: INCLUDE,
    });
    return docs.map((d) => comStatus(d, params?.diasAlerta ?? 30));
  }

  async buscarOuFalhar(id: string) {
    const doc = await this.prisma.documentoCliente.findUnique({ where: { id }, include: INCLUDE });
    if (!doc) {
      throw new NotFoundException(`Documento ${id} não encontrado.`);
    }
    return comStatus(doc, 30);
  }

  async atualizar(id: string, dto: UpdateDocumentoClienteDto) {
    const existente = await this.prisma.documentoCliente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException(`Documento ${id} não encontrado.`);
    }
    const doc = await this.prisma.documentoCliente.update({
      where: { id },
      data: {
        tipoDocumentoId: dto.tipoDocumentoId,
        dataEmissao: dto.dataEmissao ? new Date(dto.dataEmissao) : undefined,
        dataVencimento: dto.dataVencimento ? new Date(dto.dataVencimento) : undefined,
        observacoes: dto.observacoes,
      },
      include: INCLUDE,
    });
    return comStatus(doc, 30);
  }

  async remover(id: string) {
    await this.buscarOuFalhar(id);
    await this.prisma.documentoCliente.delete({ where: { id } });
  }

  /** Documentos vencidos ou vencendo nos próximos `diasAlerta` dias, para a tela inicial. */
  async alertas(diasAlerta = 30) {
    const limite = new Date();
    limite.setDate(limite.getDate() + diasAlerta);
    limite.setHours(23, 59, 59, 999);

    const docs = await this.prisma.documentoCliente.findMany({
      where: { dataVencimento: { lte: limite } },
      orderBy: { dataVencimento: 'asc' },
      include: INCLUDE,
    });

    return docs.map((d) => comStatus(d, diasAlerta));
  }
}
