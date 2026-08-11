import { Module } from '@nestjs/common';
import { DesligamentosController } from './desligamentos.controller';
import { DesligamentosService } from './desligamentos.service';

@Module({
  controllers: [DesligamentosController],
  providers: [DesligamentosService],
  exports: [DesligamentosService],
})
export class DesligamentosModule {}
