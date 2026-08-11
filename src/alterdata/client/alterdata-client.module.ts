import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlterdataHttpService } from './alterdata-http.service';

/**
 * Módulo global: o AlterdataHttpService fica disponível para todos os
 * módulos de feature (empresas, funcionarios, admissoes, ...) sem precisar
 * reimportar HttpModule em cada um deles.
 */
@Global()
@Module({
  imports: [HttpModule],
  providers: [AlterdataHttpService],
  exports: [AlterdataHttpService],
})
export class AlterdataClientModule {}
