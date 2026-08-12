import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateObrigacaoClienteDto {
  @IsString()
  clienteId!: string;

  @IsString()
  tipoObrigacaoId!: string;

  /** "2026-08" (mensal) ou "2026" (anual). */
  @IsString()
  competencia!: string;

  @IsDateString()
  dataVencimento!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
