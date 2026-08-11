import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { HistoricoTarefaItem } from './etarefa.types';

@Injectable()
export class EtarefasService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  historico(dataInicial: string, dataFinal: string) {
    return this.alterdata.get<HistoricoTarefaItem[]>(
      AlterdataService.TAREFAS,
      '/api/v1/integracao/historico-tarefas',
      { dataInicial, dataFinal },
    );
  }
}
