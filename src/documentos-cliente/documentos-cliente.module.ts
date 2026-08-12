import { Module } from '@nestjs/common';
import { DocumentosClienteController } from './documentos-cliente.controller';
import { DocumentosClienteService } from './documentos-cliente.service';

@Module({
  controllers: [DocumentosClienteController],
  providers: [DocumentosClienteService],
  exports: [DocumentosClienteService],
})
export class DocumentosClienteModule {}
