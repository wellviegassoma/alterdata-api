import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, buildRelationships, compact } from '../client/json-api.types';
import { CreateMovimentoDto } from './dto/create-movimento.dto';

@Injectable()
export class FolhaPagamentoService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  async incluirMovimento(dto: CreateMovimentoDto) {
    const attributes = compact({
      valor: dto.valor,
      inicio: dto.inicio,
      fim: dto.fim,
      comentario: dto.comentario,
      faltas: dto.faltas,
      created: new Date().toISOString(),
    });

    const relationships = buildRelationships({
      funcionario: ['funcionarios', dto.funcionarioId],
      empresa: ['empresas', dto.empresaId],
      tipomovimento: ['tipos-movimento', dto.tipoMovimentoId],
      evento: ['eventos', dto.eventoId],
    });

    return this.alterdata.post<JsonApiDocument>(AlterdataService.DP, '/api/v1/movimentos', {
      data: { type: 'movimentos', attributes, relationships },
    });
  }
}
