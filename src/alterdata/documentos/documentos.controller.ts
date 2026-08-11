import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { CreateLancamentoContabilDto } from './dto/create-lancamento-contabil.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post('lancamentos-contabeis')
  enviarLancamentoContabil(@Body() dto: CreateLancamentoContabilDto) {
    return this.documentosService.enviarLancamentoContabil(dto);
  }

  @Get()
  listar(
    @Query('empresaId') empresaId: string,
    @Query('pago') pago?: string,
    @Query('criacao') criacao?: string,
    @Query('vencimento') vencimento?: string,
    @Query('expiracao') expiracao?: string,
    @Query('pagamento') pagamento?: string,
    @Query('include') include?: string,
    @Query('sort') sort?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.documentosService.listar({
      empresaId,
      pago: pago === undefined ? undefined : pago === 'true',
      criacao,
      vencimento,
      expiracao,
      pagamento,
      include,
      sort,
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  buscarPorId(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
    @Query('include') include?: string,
    @Query('sort') sort?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('fieldsArquivos') fieldsArquivos?: string,
  ) {
    return this.documentosService.buscarPorId(id, {
      empresaId,
      include,
      sort,
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
      fieldsArquivos,
    });
  }
}
