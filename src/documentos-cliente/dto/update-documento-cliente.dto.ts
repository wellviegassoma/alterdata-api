import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDocumentoClienteDto } from './create-documento-cliente.dto';

/** Igual ao CreateDocumentoClienteDto, mas sem permitir trocar o cliente do documento. */
export class UpdateDocumentoClienteDto extends PartialType(
  OmitType(CreateDocumentoClienteDto, ['clienteId'] as const),
) {}
