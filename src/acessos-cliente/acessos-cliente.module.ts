import { Module } from '@nestjs/common';
import { AcessosClienteService } from './acessos-cliente.service';
import { AcessosClienteController } from './acessos-cliente.controller';

@Module({
  providers: [AcessosClienteService],
  controllers: [AcessosClienteController],
})
export class AcessosClienteModule {}
