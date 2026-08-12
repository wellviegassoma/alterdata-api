import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoObrigacaoFiscalDto } from './dto/create-tipo-obrigacao-fiscal.dto';
import { UpdateTipoObrigacaoFiscalDto } from './dto/update-tipo-obrigacao-fiscal.dto';

@Injectable()
export class TiposObrigacaoFiscalService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateTipoObrigacaoFiscalDto) {
    const existente = await this.prisma.tipoObrigacaoFiscal.findUnique({
      where: { nome: dto.nome },
    });
    if (existente) {
      throw new ConflictException(`Já existe uma obrigação fiscal chamada "${dto.nome}".`);
    }
    return this.prisma.tipoObrigacaoFiscal.create({
      data: { ...dto, regimesAplicaveis: dto.regimesAplicaveis ?? [] },
    });
  }

  listar(params?: { incluirInativos?: boolean }) {
    return this.prisma.tipoObrigacaoFiscal.findMany({
      where: params?.incluirInativos ? undefined : { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarOuFalhar(id: string) {
    const tipo = await this.prisma.tipoObrigacaoFiscal.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`Obrigação fiscal ${id} não encontrada.`);
    }
    return tipo;
  }

  async atualizar(id: string, dto: UpdateTipoObrigacaoFiscalDto) {
    await this.buscarOuFalhar(id);
    return this.prisma.tipoObrigacaoFiscal.update({ where: { id }, data: dto });
  }

  /** Desativa em vez de apagar, para preservar o histórico das obrigações já geradas com esse tipo. */
  async desativar(id: string) {
    await this.buscarOuFalhar(id);
    await this.prisma.tipoObrigacaoFiscal.update({ where: { id }, data: { ativo: false } });
  }
}
