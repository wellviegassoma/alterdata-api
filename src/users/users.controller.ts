import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PapelUsuario } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';

/** Gestão de usuários internos do escritório — só ADMIN cria/edita/remove. */
@Controller('usuarios-internos')
@Roles(PapelUsuario.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  atualizar(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.usersService.remover(id);
  }
}
