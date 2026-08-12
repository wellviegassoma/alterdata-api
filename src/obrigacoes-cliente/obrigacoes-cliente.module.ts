import { Module } from '@nestjs/common';
import { ObrigacoesClienteService } from './obrigacoes-cliente.service';
import { ObrigacoesClienteController } from './obrigacoes-cliente.controller';

@Module({
  providers: [ObrigacoesClienteService],
  controllers: [ObrigacoesClienteController],
})
export class ObrigacoesClienteModule {}
