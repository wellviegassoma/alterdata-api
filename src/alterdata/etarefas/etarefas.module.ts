import { Module } from '@nestjs/common';
import { EtarefasController } from './etarefas.controller';
import { EtarefasService } from './etarefas.service';

@Module({
  controllers: [EtarefasController],
  providers: [EtarefasService],
  exports: [EtarefasService],
})
export class EtarefasModule {}
