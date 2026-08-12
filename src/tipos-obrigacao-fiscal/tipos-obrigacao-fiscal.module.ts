import { Module } from '@nestjs/common';
import { TiposObrigacaoFiscalService } from './tipos-obrigacao-fiscal.service';
import { TiposObrigacaoFiscalController } from './tipos-obrigacao-fiscal.controller';

@Module({
  providers: [TiposObrigacaoFiscalService],
  controllers: [TiposObrigacaoFiscalController],
  exports: [TiposObrigacaoFiscalService],
})
export class TiposObrigacaoFiscalModule {}
