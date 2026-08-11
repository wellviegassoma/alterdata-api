import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument } from '../client/json-api.types';

export interface CategoriaDocumentoAttributes {
  personalizada: boolean;
  pagavel: boolean;
  login?: number | null;
  descricao: string;
}

@Injectable()
export class CategoriasService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  /** filter[login] é obrigatório: filtra categorias que o usuário/login possui permissão de ver. */
  listar(login: number | string) {
    return this.alterdata.get<JsonApiDocument<CategoriaDocumentoAttributes>>(
      AlterdataService.DOCUMENTOS,
      '/api/v1/integracao/categoria-documento',
      { 'filter[login]': login },
    );
  }
}
