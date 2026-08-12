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
import { ObrigacoesClienteService } from './obrigacoes-cliente.service';
import { CreateObrigacaoClienteDto } from './dto/create-obrigacao-cliente.dto';
import { UpdateObrigacaoClienteDto } from './dto/update-obrigacao-cliente.dto';
import { GerarObrigacoesDto } from './dto/gerar-obrigacoes.dto';

@Controller('obrigacoes-cliente')
export class ObrigacoesClienteController {
  constructor(private readonly obrigacoesClienteService: ObrigacoesClienteService) {}

  @Post()
  criar(@Body() dto: CreateObrigacaoClienteDto) {
    return this.obrigacoesClienteService.criar(dto);
  }

  /** Gera em lote as obrigações da competência (ex.: "2026-08") pros clientes aplicáveis. */
  @Post('gerar')
  gerar(@Body() dto: GerarObrigacoesDto) {
    return this.obrigacoesClienteService.gerar(dto);
  }

  /** Não cumpridas, vencidas ou vencendo nos próximos `dias` dias (padrão 30) — pra tela inicial. */
  @Get('alertas')
  alertas(@Query('dias') dias?: string) {
    return this.obrigacoesClienteService.alertas(dias ? Number(dias) : undefined);
  }

  @Get()
  listar(@Query('clienteId') clienteId?: string, @Query('diasAlerta') diasAlerta?: string) {
    return this.obrigacoesClienteService.listar({
      clienteId,
      diasAlerta: diasAlerta ? Number(diasAlerta) : undefined,
    });
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateObrigacaoClienteDto) {
    return this.obrigacoesClienteService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.obrigacoesClienteService.remover(id);
  }
}
