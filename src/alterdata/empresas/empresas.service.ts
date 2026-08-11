import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, compact } from '../client/json-api.types';
import { EmpresaAttributes, EmpresaSimplificadaAttributes } from './empresa.types';

@Injectable()
export class EmpresasService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  listar(params?: { ativa?: boolean; offset?: number; limit?: number }) {
    const query = compact({
      'filter[empresas][ativa][EQ]': params?.ativa,
      'page[offset]': params?.offset,
      'page[limit]': params?.limit,
    });
    return this.alterdata.get<JsonApiDocument<EmpresaAttributes>>(
      AlterdataService.DP,
      '/api/v1/empresas',
      query,
    );
  }

  buscarPorId(id: string | number) {
    return this.alterdata.get<JsonApiDocument<EmpresaAttributes>>(
      AlterdataService.DP,
      `/api/v1/empresas/${id}`,
    );
  }

  /** Versão simplificada (identificacao.pack): traz nomeFantasia e codigo, que o endpoint de DP não retorna. */
  buscarSimplificadaPorId(id: string | number) {
    return this.alterdata.get<JsonApiDocument<EmpresaSimplificadaAttributes>>(
      AlterdataService.IDENTIFICACAO,
      `/api/v1/integracao/empresas/${id}`,
    );
  }

  /** Empresas vinculadas a um usuário (CPF/CNPJ de login), na versão simplificada. */
  listarPorUsuario(usuarioId: string, params?: { offset?: number; limit?: number }) {
    const query = compact({
      'page[offset]': params?.offset,
      'page[limit]': params?.limit,
    });
    return this.alterdata.get<JsonApiDocument<EmpresaSimplificadaAttributes>>(
      AlterdataService.IDENTIFICACAO,
      `/api/v1/integracao/usuarios/${usuarioId}/relationships/empresas`,
      query,
    );
  }

  /**
   * Visão consolidada de uma empresa: mescla os dados completos (dp.pack,
   * indexados pelo id sequencial) com os campos exclusivos da versão
   * simplificada (identificacao.pack, indexada pelo CNPJ/cpfCnpjAlfanumerico
   * — os dois serviços usam esquemas de id diferentes).
   */
  async buscarCompletaPorId(id: string | number) {
    const completa = await this.buscarPorId(id);
    const dataCompleta = Array.isArray(completa.data) ? completa.data[0] : completa.data;
    const cnpj = dataCompleta.attributes?.cpfCnpjAlfanumerico;

    const simplificada = cnpj ? await this.buscarSimplificadaPorId(cnpj).catch(() => null) : null;
    const simplificadaAttrs =
      simplificada && !Array.isArray(simplificada.data) ? simplificada.data?.attributes : undefined;

    return {
      id: dataCompleta.id,
      ...dataCompleta.attributes,
      nomeFantasia: simplificadaAttrs?.nomeFantasia,
      codigo: simplificadaAttrs?.codigo,
    };
  }
}
