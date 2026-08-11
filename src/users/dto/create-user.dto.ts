import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { PapelUsuario } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  senha!: string;

  @IsEnum(PapelUsuario)
  papel!: PapelUsuario;
}
