import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/** Igual ao CreateUserDto, mas tudo opcional e sem alterar senha por aqui (ver AuthService.trocarSenha). */
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['senha'] as const)) {}
