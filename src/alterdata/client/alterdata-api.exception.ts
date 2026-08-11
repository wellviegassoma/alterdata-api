import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Erro originado por uma chamada à API da Alterdata (ePlugin).
 * Preserva o status e o corpo de erro retornados pelo upstream para
 * facilitar o diagnóstico (ex.: 400 campo obrigatório ausente,
 * 401 token inválido/expirado, 422 formato de dado inválido).
 */
export class AlterdataApiException extends HttpException {
  constructor(
    public readonly upstreamStatus: number,
    public readonly upstreamBody: unknown,
    message = 'Erro ao comunicar com a API da Alterdata (ePlugin)',
  ) {
    super(
      {
        message,
        upstreamStatus,
        upstreamBody,
      },
      AlterdataApiException.mapStatus(upstreamStatus),
    );
  }

  private static mapStatus(status: number): HttpStatus {
    switch (status) {
      case 400:
        return HttpStatus.BAD_REQUEST;
      case 401:
      case 403:
        return HttpStatus.UNAUTHORIZED;
      case 404:
        return HttpStatus.NOT_FOUND;
      case 422:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      default:
        return HttpStatus.BAD_GATEWAY;
    }
  }
}
