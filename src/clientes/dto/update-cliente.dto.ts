import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

/** Igual ao CreateClienteDto, mas com tudo opcional e sem permitir trocar cnpjCpf (chave de vínculo com o eContador). */
export class UpdateClienteDto extends PartialType(OmitType(CreateClienteDto, ['cnpjCpf'] as const)) {}
