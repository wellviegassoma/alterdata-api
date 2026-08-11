import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  health() {
    return {
      status: 'ok',
      service: 'alterdata-api',
      tokenConfigurado: Boolean(this.configService.get<string>('alterdata.token')),
    };
  }
}
