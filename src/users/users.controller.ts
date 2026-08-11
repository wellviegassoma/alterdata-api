import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PapelUsuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Gestão de usuários internos do escritório. Leitura (GET) é liberada para
 * qualquer usuário autenticado — necessário para o seletor de "responsável"
 * no cadastro de clientes. Criar/editar/remover continua só ADMIN.
 */
@Controller('usuarios-internos')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(PapelUsuario.ADMIN)
  criar(@Body() dto: CreateUserDto) {
    return this.usersService.criar(dto);
  }

  @Get()
  listar() {
    return this.usersService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.usersService.buscarPorIdOuFalhar(id);
  }

  @Patch(':id')
  @Roles(PapelUsuario.ADMIN)
  atualizar(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.atualizar(id, dto);
  }

  @Delete(':id')
  @Roles(PapelUsuario.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.usersService.remover(id);
  }
}
