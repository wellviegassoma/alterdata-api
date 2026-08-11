import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, buildRelationships, compact } from '../client/json-api.types';
import { CreateAgendamentoFeriasDto } from './dto/create-agendamento-ferias.dto';

@Injectable()
export class FeriasService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  async agendar(dto: CreateAgendamentoFeriasDto) {
    const attributes = compact({
      de: dto.de,
      ate: dto.ate,
      adiantamentodecimoterceiro: dto.adiantamentodecimoterceiro,
      solicitacao: dto.solicitacao,
      abonodias: dto.abonodias,
      anotacoes: dto.anotacoes,
    });

    const relationships = buildRelationships({
      funcionario: ['funcionarios', dto.funcionarioId],
      status: ['tipos-status-agendamento', dto.statusId],
    });

    return this.alterdata.post<JsonApiDocument>(AlterdataService.DP, '/api/v1/agendamentos-ferias', {
      data: { type: 'agendamentos-ferias', attributes, relationships },
    });
  }
}
