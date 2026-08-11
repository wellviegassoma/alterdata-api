import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  listar(
    @Query('ativa') ativa?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.empresasService.listar({
      ativa: ativa === undefined ? undefined : ativa === 'true',
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.empresasService.buscarPorId(id);
  }

  @Get(':id/simplificada')
  buscarSimplificadaPorId(@Param('id') id: string) {
    return this.empresasService.buscarSimplificadaPorId(id);
  }

  @Get(':id/completa')
  buscarCompletaPorId(@Param('id') id: string) {
    return this.empresasService.buscarCompletaPorId(id);
  }
}
