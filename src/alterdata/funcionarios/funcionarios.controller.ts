import { Controller, Get, Param, Query } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Get()
  listar(
    @Query('empresaId') empresaId?: string,
    @Query('status') status?: 'ativo',
    @Query('fields') fields?: string,
    @Query('sort') sort?: string,
  ) {
    return this.funcionariosService.listar({
      empresaId: empresaId ? Number(empresaId) : undefined,
      status,
      fields,
      sort,
    });
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string, @Query('include') include?: string) {
    return this.funcionariosService.buscarPorId(id, include);
  }

  @Get(':id/historico-funcoes')
  historicoDeFuncoes(@Param('id') id: string) {
    return this.funcionariosService.historicoDeFuncoes(id);
  }
}
