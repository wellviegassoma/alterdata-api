import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { LookupsService } from './lookups.service';

const SAFE_TYPE = /^[a-zA-Z0-9-]+$/;

/**
 * Endpoint genérico para consultar os "resources" de referência do ePlugin
 * (ex.: GET /lookups/tipos-estado-civil, GET /lookups/estados/21) usados
 * para montar os relationships exigidos pelos endpoints de escrita.
 */
@Controller('lookups')
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get(':type')
  listar(@Param('type') type: string) {
    this.validarType(type);
    return this.lookupsService.listar(type);
  }

  @Get(':type/:id')
  buscarPorId(@Param('type') type: string, @Param('id') id: string) {
    this.validarType(type);
    return this.lookupsService.buscarPorId(type, id);
  }

  private validarType(type: string) {
    if (!SAFE_TYPE.test(type)) {
      throw new BadRequestException(
        'type inválido: use apenas letras, números e hífen (ex.: tipos-estado-civil).',
      );
    }
  }
}
