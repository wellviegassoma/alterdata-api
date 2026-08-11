import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SAFE_SELECT = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateUserDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException(`Já existe um usuário com o e-mail ${dto.email}.`);
    }

    const senhaHash = await bcrypt.hash(dto.senha, 12);
    return this.prisma.usuario.create({
      data: { nome: dto.nome, email: dto.email, senhaHash, papel: dto.papel },
      select: SAFE_SELECT,
    });
  }

  listar() {
    return this.prisma.usuario.findMany({ select: SAFE_SELECT, orderBy: { nome: 'asc' } });
  }

  async buscarPorIdOuFalhar(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id }, select: SAFE_SELECT });
    if (!usuario) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }
    return usuario;
  }

  /** Uso interno do AuthService (inclui senhaHash) — não expor em controllers. */
  buscarPorEmailComSenha(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async atualizar(id: string, dto: UpdateUserDto) {
    await this.buscarPorIdOuFalhar(id);
    return this.prisma.usuario.update({
      where: { id },
      data: { nome: dto.nome, email: dto.email, papel: dto.papel },
      select: SAFE_SELECT,
    });
  }

  async remover(id: string) {
    await this.buscarPorIdOuFalhar(id);
    await this.prisma.usuario.delete({ where: { id } });
  }
}
