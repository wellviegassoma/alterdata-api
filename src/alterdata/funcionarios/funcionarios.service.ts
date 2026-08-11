import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, compact } from '../client/json-api.types';
import { FuncionarioAttributes, HistoricoFuncaoAttributes } from './funcionario.types';

@Injectable()
export class FuncionariosService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  listar(params?: { empresaId?: number; status?: 'ativo'; fields?: string; sort?: string }) {
    const query = compact({
      'filter[empresaId]': params?.empresaId,
      'filter[status]': params?.status,
      fields: params?.fields,
      sort: params?.sort,
    });
    return this.alterdata.get<JsonApiDocument<FuncionarioAttributes>>(
      AlterdataService.DP,
      '/api/v1/funcionarios',
      query,
    );
  }

  /**
   * A busca por id do ePlugin usa filter[id], não um path param
   * (GET /api/v1/funcionarios?filter[id]=...). `include` aceita:
   * naturalidade, estado, foto, estadocivil, departamento, sexo,
   * formadepagamento, nacionalidade, pais, tipoDeConta, tipoDeChavePix.
   */
  buscarPorId(id: string | number, include?: string) {
    const query = compact({
      'filter[id]': id,
      include,
    });
    return this.alterdata.get<JsonApiDocument<FuncionarioAttributes>>(
      AlterdataService.DP,
      '/api/v1/funcionarios',
      query,
    );
  }

  historicoDeFuncoes(funcionarioId: string | number) {
    return this.alterdata.get<JsonApiDocument<HistoricoFuncaoAttributes>>(
      AlterdataService.DP,
      '/api/v1/historico-funcoes',
      { 'filter[funcionarioId]': funcionarioId },
    );
  }
}
