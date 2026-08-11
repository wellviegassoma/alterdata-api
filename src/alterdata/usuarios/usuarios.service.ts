import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, compact } from '../client/json-api.types';
import { UsuarioAttributes, VerticalAttributes } from './usuario.types';

@Injectable()
export class UsuariosService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  /** id = CPF ou CNPJ (login) do usuário. */
  buscarPorId(id: string) {
    return this.alterdata.get<JsonApiDocument<UsuarioAttributes>>(
      AlterdataService.IDENTIFICACAO,
      `/api/v1/integracao/usuarios/${id}`,
    );
  }

  listar(params?: { offset?: number; limit?: number }) {
    const query = compact({
      'page[offset]': params?.offset,
      'page[limit]': params?.limit,
    });
    return this.alterdata.get<JsonApiDocument<UsuarioAttributes>>(
      AlterdataService.IDENTIFICACAO,
      '/api/v1/integracao/usuarios',
      query,
    );
  }

  verificarVertical() {
    return this.alterdata.get<JsonApiDocument<VerticalAttributes>>(
      AlterdataService.IDENTIFICACAO,
      '/api/v1/integracao/user-connections/verificar-vertical',
    );
  }
}
