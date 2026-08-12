import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AcessosClienteService } from './acessos-cliente.service';
import { CreateAcessoClienteDto } from './dto/create-acesso-cliente.dto';
import { UpdateAcessoClienteDto } from './dto/update-acesso-cliente.dto';

@Controller('acessos-cliente')
export class AcessosClienteController {
  constructor(private readonly acessosClienteService: AcessosClienteService) {}

  @Post()
  criar(@Body() dto: CreateAcessoClienteDto) {
    return this.acessosClienteService.criar(dto);
  }

  @Get()
  listar(@Query('clienteId') clienteId?: string) {
    return this.acessosClienteService.listar({ clienteId });
  }

  /** Descriptografa e retorna a senha — só chamado quando o usuário pede pra ver. */
  @Get(':id/revelar')
  async revelar(@Param('id') id: string) {
    return { senha: await this.acessosClienteService.revelarSenha(id) };
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateAcessoClienteDto) {
    return this.acessosClienteService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.acessosClienteService.remover(id);
  }
}
