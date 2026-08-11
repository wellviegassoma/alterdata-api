import { Controller, Get, Query } from '@nestjs/common';
import { EtarefasService } from './etarefas.service';

@Controller('etarefas')
export class EtarefasController {
  constructor(private readonly etarefasService: EtarefasService) {}

  @Get('historico')
  historico(@Query('dataInicial') dataInicial: string, @Query('dataFinal') dataFinal: string) {
    return this.etarefasService.historico(dataInicial, dataFinal);
  }
}
