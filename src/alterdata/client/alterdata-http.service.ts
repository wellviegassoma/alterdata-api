import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AlterdataConfig } from '../../config/alterdata.config';
import { AlterdataService } from './alterdata-service.enum';
import { AlterdataApiException } from './alterdata-api.exception';

/**
 * Cliente HTTP central para o ePlugin da Alterdata. Resolve a base URL de
 * cada microsserviço, injeta o header Authorization: Bearer TOKEN e o
 * Content-Type application/vnd.api+json exigido pelo JSON:API, e traduz
 * falhas HTTP em AlterdataApiException.
 */
@Injectable()
export class AlterdataHttpService {
  private readonly logger = new Logger(AlterdataHttpService.name);

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get<T>(
    service: AlterdataService,
    path: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    return this.request<T>(service, { method: 'GET', url: path, params });
  }

  async post<T>(service: AlterdataService, path: string, body: unknown): Promise<T> {
    return this.request<T>(service, {
      method: 'POST',
      url: path,
      data: body,
      headers: { 'Content-Type': 'application/vnd.api+json' },
    });
  }

  private baseUrl(service: AlterdataService): string {
    const config = this.configService.get<AlterdataConfig>('alterdata');
    const url = config?.baseUrls[service];
    if (!url) {
      throw new InternalServerErrorException(
        `URL base não configurada para o serviço Alterdata "${service}".`,
      );
    }
    return url;
  }

  private token(): string {
    const config = this.configService.get<AlterdataConfig>('alterdata');
    if (!config?.token) {
      throw new InternalServerErrorException(
        'ALTERDATA_TOKEN não configurado. Gere o token em eContador > Configurações > ePlugin e defina-o no .env.',
      );
    }
    return config.token;
  }

  private async request<T>(service: AlterdataService, config: AxiosRequestConfig): Promise<T> {
    const alterdataConfig = this.configService.get<AlterdataConfig>('alterdata');
    const { data } = await firstValueFrom(
      this.http
        .request<T>({
          ...config,
          baseURL: this.baseUrl(service),
          timeout: alterdataConfig?.timeoutMs,
          headers: {
            Authorization: `Bearer ${this.token()}`,
            ...config.headers,
          },
        })
        .pipe(
          catchError((error) => {
            const status = error.response?.status ?? 502;
            const body = error.response?.data ?? error.message;
            this.logger.error(
              `Falha ao chamar ${service.toUpperCase()} ${config.method} ${config.url}: [${status}] ${JSON.stringify(body)}`,
            );
            throw new AlterdataApiException(status, body);
          }),
        ),
    );
    return data;
  }
}
