import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument } from '../client/json-api.types';

/**
 * Consulta genérica de dados de referência ("resources") usados para montar
 * relationships do JSON:API (ex.: tipos-estado-civil, estados,
 * tipos-vinculos-trabalhista). Conforme a documentação do ePlugin:
 * "É possível obter seus respectivos valores fazendo uma requisição do tipo
 * GET, fornecendo a rota que é o próprio type", em dp.pack.alterdata.com.br.
 */
@Injectable()
export class LookupsService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  listar(type: string) {
    return this.alterdata.get<JsonApiDocument>(AlterdataService.DP, `/api/v1/${type}`);
  }

  buscarPorId(type: string, id: string | number) {
    return this.alterdata.get<JsonApiDocument>(AlterdataService.DP, `/api/v1/${type}/${id}`);
  }
}
