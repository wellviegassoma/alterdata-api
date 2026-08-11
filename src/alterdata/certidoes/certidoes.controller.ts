import { Controller, Get, Param, Query } from '@nestjs/common';
import { CertidoesService } from './certidoes.service';

@Controller('certidoes')
export class CertidoesController {
  constructor(private readonly certidoesService: CertidoesService) {}

  @Get('tipos')
  listarTipos(@Query('usuario') usuario?: string) {
    return this.certidoesService.listarTipos(usuario);
  }

  @Get('tipos/:id')
  buscarTipoPorId(@Param('id') id: string) {
    return this.certidoesService.buscarTipoPorId(id);
  }

  @Get()
  listar(
    @Query('empresaId') empresaId: string,
    @Query('ultimasEmissoes') ultimasEmissoes?: string,
    @Query('include') include?: string,
    @Query('fields') fields?: string,
    @Query('sort') sort?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.certidoesService.listar({
      empresaId,
      ultimasEmissoes: ultimasEmissoes === undefined ? undefined : ultimasEmissoes === 'true',
      include,
      fields,
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
  ) {
    return this.certidoesService.buscarPorId(id, { empresaId, include, sort });
  }
}
