import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private readonly prisma: PrismaService) {}

  /** Dump completo do banco próprio (não inclui dados do eContador, que continuam na Alterdata). */
  async gerar() {
    const [usuarios, clientes, tiposDocumento, documentosCliente, tags] = await Promise.all([
      this.prisma.usuario.findMany({
        select: { id: true, nome: true, email: true, papel: true, createdAt: true, updatedAt: true },
      }),
      this.prisma.cliente.findMany({
        include: {
          contatos: true,
          endereco: true,
          dadosFiscais: true,
          contrato: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.tipoDocumento.findMany(),
      this.prisma.documentoCliente.findMany(),
      this.prisma.tag.findMany(),
    ]);

    return {
      geradoEm: new Date().toISOString(),
      usuarios,
      clientes,
      tiposDocumento,
      documentosCliente,
      tags,
    };
  }
}
