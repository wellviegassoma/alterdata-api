import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, buildRelationships, compact } from '../client/json-api.types';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';

@Injectable()
export class AtendimentosService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  async abrir(dto: CreateAtendimentoDto) {
    const agora = new Date().toISOString();

    const attributes = compact({
      descricao: dto.descricao,
      previsao: dto.previsao,
      abertura: agora,
      aberto: dto.aberto ?? true,
      abertoNaWeb: dto.abertoNaWeb ?? true,
      exportado: false,
      abridorId: dto.abridorId,
      parecerInicial: compact({
        texto: dto.parecerTexto,
        data: dto.parecerData ?? agora,
      }),
    });

    const relationships = buildRelationships({
      empresa: ['empresas', dto.empresaId],
      departamento: ['integracao/departamentos-do-bureau', dto.departamentoId],
      operador: ['operadores', dto.operadorId],
    });

    return this.alterdata.post<JsonApiDocument>(
      AlterdataService.ATENDIMENTOS,
      '/api/v1/integracao/atendimentos',
      { data: { type: 'integracao/atendimentos', attributes, relationships } },
    );
  }
}
