import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok', () => {
      expect(appController.health()).toEqual({
        status: 'ok',
        service: 'alterdata-api',
        tokenConfigurado: false,
      });
    });
  });
});
