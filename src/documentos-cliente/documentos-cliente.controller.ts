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
import { DocumentosClienteService } from './documentos-cliente.service';
import { CreateDocumentoClienteDto } from './dto/create-documento-cliente.dto';
import { UpdateDocumentoClienteDto } from './dto/update-documento-cliente.dto';

@Controller('documentos-cliente')
export class DocumentosClienteController {
  constructor(private readonly documentosClienteService: DocumentosClienteService) {}

  @Post()
  criar(@Body() dto: CreateDocumentoClienteDto) {
    return this.documentosClienteService.criar(dto);
  }

  /** Vencidos ou vencendo nos próximos `dias` dias (padrão 30) — para alertas na tela inicial. */
  @Get('alertas')
  alertas(@Query('dias') dias?: string) {
    return this.documentosClienteService.alertas(dias ? Number(dias) : undefined);
  }

  @Get()
  listar(@Query('clienteId') clienteId?: string, @Query('diasAlerta') diasAlerta?: string) {
    return this.documentosClienteService.listar({
      clienteId,
      diasAlerta: diasAlerta ? Number(diasAlerta) : undefined,
    });
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateDocumentoClienteDto) {
    return this.documentosClienteService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    await this.documentosClienteService.remover(id);
  }
}
