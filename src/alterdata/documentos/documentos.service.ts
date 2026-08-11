import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, compact } from '../client/json-api.types';
import { DocumentoAttributes } from './documento.types';
import { CreateLancamentoContabilDto } from './dto/create-lancamento-contabil.dto';

@Injectable()
export class DocumentosService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  listar(params: {
    empresaId: number | string;
    pago?: boolean;
    criacao?: string;
    vencimento?: string;
    expiracao?: string;
    pagamento?: string;
    include?: string;
    sort?: string;
    offset?: number;
    limit?: number;
  }) {
    const query = compact({
      'filter[empresaId]': params.empresaId,
      'filter[pago]': params.pago,
      'filter[criacao]': params.criacao,
      'filter[vencimento]': params.vencimento,
      'filter[expiracao]': params.expiracao,
      'filter[pagamento]': params.pagamento,
      include: params.include,
      sort: params.sort,
      'page[offset]': params.offset,
      'page[limit]': params.limit,
    });
    return this.alterdata.get<JsonApiDocument<DocumentoAttributes>>(
      AlterdataService.DOCUMENTOS,
      '/api/v1/integracao/documentos',
      query,
    );
  }

  buscarPorId(
    id: string | number,
    params: {
      empresaId: number | string;
      include?: string;
      sort?: string;
      offset?: number;
      limit?: number;
      fieldsArquivos?: string;
    },
  ) {
    const query = compact({
      'filter[empresaId]': params.empresaId,
      include: params.include,
      sort: params.sort,
      'page[offset]': params.offset,
      'page[limit]': params.limit,
      'fields[arquivos]': params.fieldsArquivos,
    });
    return this.alterdata.get<JsonApiDocument<DocumentoAttributes>>(
      AlterdataService.DOCUMENTOS,
      `/api/v1/integracao/documentos/${id}`,
      query,
    );
  }

  enviarLancamentoContabil(dto: CreateLancamentoContabilDto) {
    return this.alterdata.post<JsonApiDocument>(
      AlterdataService.DOCUMENTOS,
      '/api/v1/integracao/integracaoAlterdata',
      {
        data: {
          type: 'integracao/integracaoAlterdata',
          attributes: {
            documento: dto.documento,
            categoriaId: dto.categoriaId,
            cnpjremetente: dto.cnpjremetente,
            arquivoBase64: dto.arquivoBase64,
          },
        },
      },
    );
  }
}
