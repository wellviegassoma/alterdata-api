import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { encrypt, decrypt } from '../common/crypto.util';
import { CreateAcessoClienteDto } from './dto/create-acesso-cliente.dto';
import { UpdateAcessoClienteDto } from './dto/update-acesso-cliente.dto';

/** Seleção sem `senhaCifrada` — a lista nunca expõe a senha, nem cifrada. */
const SELECT_SEM_SENHA = {
  id: true,
  clienteId: true,
  portal: true,
  login: true,
  observacoes: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AcessosClienteService {
  constructor(private readonly prisma: PrismaService) {}

  criar(dto: CreateAcessoClienteDto) {
    return this.prisma.acessoCliente.create({
      data: {
        clienteId: dto.clienteId,
        portal: dto.portal,
        login: dto.login,
        senhaCifrada: encrypt(dto.senha),
        observacoes: dto.observacoes,
      },
      select: SELECT_SEM_SENHA,
    });
  }

  listar(params?: { clienteId?: string }) {
    return this.prisma.acessoCliente.findMany({
      where: params?.clienteId ? { clienteId: params.clienteId } : undefined,
      orderBy: { portal: 'asc' },
      select: SELECT_SEM_SENHA,
    });
  }

  async revelarSenha(id: string): Promise<string> {
    const acesso = await this.prisma.acessoCliente.findUnique({ where: { id } });
    if (!acesso) {
      throw new NotFoundException(`Acesso ${id} não encontrado.`);
    }
    return decrypt(acesso.senhaCifrada);
  }

  async atualizar(id: string, dto: UpdateAcessoClienteDto) {
    const existente = await this.prisma.acessoCliente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException(`Acesso ${id} não encontrado.`);
    }
    return this.prisma.acessoCliente.update({
      where: { id },
      data: {
        portal: dto.portal,
        login: dto.login,
        senhaCifrada: dto.senha ? encrypt(dto.senha) : undefined,
        observacoes: dto.observacoes,
      },
      select: SELECT_SEM_SENHA,
    });
  }

  async remover(id: string) {
    const existente = await this.prisma.acessoCliente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException(`Acesso ${id} não encontrado.`);
    }
    await this.prisma.acessoCliente.delete({ where: { id } });
  }
}
