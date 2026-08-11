import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, compact } from '../client/json-api.types';
import { CertidaoAttributes, TipoCertidaoAttributes } from './certidao.types';

@Injectable()
export class CertidoesService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  listar(params: {
    empresaId: number | string;
    ultimasEmissoes?: boolean;
    include?: string;
    fields?: string;
    sort?: string;
    offset?: number;
    limit?: number;
  }) {
    const query = compact({
      'filter[empresaId]': params.empresaId,
      'filter[ultimasemissoes]': params.ultimasEmissoes,
      include: params.include,
      fields: params.fields,
      sort: params.sort,
      'page[offset]': params.offset,
      'page[limit]': params.limit,
    });
    return this.alterdata.get<JsonApiDocument<CertidaoAttributes>>(
      AlterdataService.CND,
      '/api/v1/integracao/certidoes',
      query,
    );
  }

  buscarPorId(
    id: string | number,
    params: { empresaId: number | string; include?: string; sort?: string },
  ) {
    const query = compact({
      'filter[empresaId]': params.empresaId,
      include: params.include,
      sort: params.sort,
    });
    return this.alterdata.get<JsonApiDocument<CertidaoAttributes>>(
      AlterdataService.CND,
      `/api/v1/integracao/certidoes/${id}`,
      query,
    );
  }

  listarTipos(usuario?: number | string) {
    const query = compact({ 'filter[usuario]': usuario });
    return this.alterdata.get<JsonApiDocument<TipoCertidaoAttributes>>(
      AlterdataService.CND,
      '/api/v1/integracao/tipoCertidao',
      query,
    );
  }

  buscarTipoPorId(id: string | number) {
    return this.alterdata.get<JsonApiDocument<TipoCertidaoAttributes>>(
      AlterdataService.CND,
      `/api/v1/integracao/tipoCertidao/${id}`,
    );
  }
}
