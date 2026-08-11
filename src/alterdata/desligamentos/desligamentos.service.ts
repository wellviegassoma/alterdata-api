import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, buildRelationships, compact } from '../client/json-api.types';
import { CreateDesligamentoDto } from './dto/create-desligamento.dto';

@Injectable()
export class DesligamentosService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  async criar(dto: CreateDesligamentoDto) {
    const attributes = compact({
      solicitacao: dto.solicitacao,
      criacao: new Date().toISOString(),
      simulacao: dto.simulacao ?? false,
    });

    const relationships = buildRelationships({
      funcionario: ['funcionarios', dto.funcionarioId],
      empresa: ['empresas', dto.empresaId],
      documentorescisao: ['tipos-documento-rescisao', dto.documentoRescisaoId],
      avisoPrevio: ['tipos-aviso-previo', dto.avisoPrevioId],
      emissornotificacao: ['tipos-emissor', dto.emissorNotificacaoId],
      tipoDesligamento: ['tipos-desligamento', dto.tipoDesligamentoId],
    });

    return this.alterdata.post<JsonApiDocument>(
      AlterdataService.DP,
      '/api/v1/notificacoes-rescisao',
      { data: { type: 'notificacoes-rescisao', attributes, relationships } },
    );
  }
}
