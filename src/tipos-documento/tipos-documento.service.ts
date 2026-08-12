import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@Injectable()
export class TiposDocumentoService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateTipoDocumentoDto) {
    const existente = await this.prisma.tipoDocumento.findUnique({ where: { nome: dto.nome } });
    if (existente) {
      throw new ConflictException(`Já existe um tipo de documento chamado "${dto.nome}".`);
    }
    return this.prisma.tipoDocumento.create({ data: dto });
  }

  listar(params?: { incluirInativos?: boolean }) {
    return this.prisma.tipoDocumento.findMany({
      where: params?.incluirInativos ? undefined : { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarOuFalhar(id: string) {
    const tipo = await this.prisma.tipoDocumento.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`Tipo de documento ${id} não encontrado.`);
    }
    return tipo;
  }

  async atualizar(id: string, dto: UpdateTipoDocumentoDto) {
    await this.buscarOuFalhar(id);
    return this.prisma.tipoDocumento.update({ where: { id }, data: dto });
  }

  /** Desativa em vez de apagar, para preservar o histórico dos documentos já lançados com esse tipo. */
  async desativar(id: string) {
    await this.buscarOuFalhar(id);
    await this.prisma.tipoDocumento.update({ where: { id }, data: { ativo: false } });
  }
}
