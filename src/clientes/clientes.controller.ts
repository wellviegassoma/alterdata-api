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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() dto: CreateClienteDto) {
    return this.clientesService.criar(dto);
  }

  /** Importa/sincroniza toda empresa ativa no eContador: cria quem falta e completa nome/código/endereço de quem já existe. */
  @Post('importar-ativos')
  importarAtivos() {
    return this.clientesService.importarAtivos();
  }

  @Get()
  listar(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.clientesService.listar({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      status,
    });
  }

  @Get(':cnpjCpf')
  buscarLocal(@Param('cnpjCpf') cnpjCpf: string) {
    return this.clientesService.buscarLocalOuFalhar(cnpjCpf);
  }

  @Get(':cnpjCpf/completo')
  buscarCompleto(@Param('cnpjCpf') cnpjCpf: string) {
    return this.clientesService.buscarCompleto(cnpjCpf);
  }

  @Patch(':cnpjCpf')
  atualizar(@Param('cnpjCpf') cnpjCpf: string, @Body() dto: UpdateClienteDto) {
    return this.clientesService.atualizar(cnpjCpf, dto);
  }

  @Delete(':cnpjCpf')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('cnpjCpf') cnpjCpf: string) {
    await this.clientesService.remover(cnpjCpf);
  }
}
