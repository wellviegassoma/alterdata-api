import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAcessoClienteDto } from './create-acesso-cliente.dto';

/** Igual ao CreateAcessoClienteDto, mas sem permitir trocar o cliente do acesso. */
export class UpdateAcessoClienteDto extends PartialType(
  OmitType(CreateAcessoClienteDto, ['clienteId'] as const),
) {}
