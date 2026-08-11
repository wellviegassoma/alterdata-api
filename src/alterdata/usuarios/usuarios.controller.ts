import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('vertical')
  verificarVertical() {
    return this.usuariosService.verificarVertical();
  }

  @Get()
  listar(@Query('offset') offset?: string, @Query('limit') limit?: string) {
    return this.usuariosService.listar({
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(id);
  }
}
