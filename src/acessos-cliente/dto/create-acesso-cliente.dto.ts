import { IsOptional, IsString } from 'class-validator';

export class CreateAcessoClienteDto {
  @IsString()
  clienteId!: string;

  @IsString()
  portal!: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsString()
  senha!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
