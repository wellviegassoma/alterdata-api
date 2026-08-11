import { Module } from '@nestjs/common';
import { CertidoesController } from './certidoes.controller';
import { CertidoesService } from './certidoes.service';

@Module({
  controllers: [CertidoesController],
  providers: [CertidoesService],
  exports: [CertidoesService],
})
export class CertidoesModule {}
