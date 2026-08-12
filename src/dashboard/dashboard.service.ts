import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async analitico() {
    const clientes = await this.prisma.cliente.findMany({
      select: { status: true, dadosFiscais: { select: { regimeTributario: true } } },
    });

    const porStatusMap = new Map<string, number>();
    const porRegimeMap = new Map<string, number>();
    for (const cliente of clientes) {
      porStatusMap.set(cliente.status, (porStatusMap.get(cliente.status) ?? 0) + 1);
      const regime = cliente.dadosFiscais?.regimeTributario ?? 'NAO_INFORMADO';
      porRegimeMap.set(regime, (porRegimeMap.get(regime) ?? 0) + 1);
    }

    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        _count: { select: { clientesFiscal: true, clientesContabil: true, clientesDp: true } },
      },
    });

    const porResponsavel = usuarios
      .map((usuario) => ({
        usuarioId: usuario.id,
        nome: usuario.nome,
        fiscal: usuario._count.clientesFiscal,
        contabil: usuario._count.clientesContabil,
        dp: usuario._count.clientesDp,
        total: usuario._count.clientesFiscal + usuario._count.clientesContabil + usuario._count.clientesDp,
      }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      porStatus: [...porStatusMap.entries()].map(([status, total]) => ({ status, total })),
      porRegime: [...porRegimeMap.entries()].map(([regime, total]) => ({ regime, total })),
      porResponsavel,
    };
  }
}
