import { PeriodicidadeObrigacao, RegimeTributario } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTipoObrigacaoFiscalDto {
  @IsString()
  nome!: string;

  @IsEnum(PeriodicidadeObrigacao)
  periodicidade!: PeriodicidadeObrigacao;

  @IsInt()
  @Min(1)
  @Max(31)
  diaVencimento!: number;

  /** Só relevante quando periodicidade = ANUAL. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mesVencimento?: number;

  /** Regimes tributários aos quais essa obrigação se aplica; vazio/omitido = todos. */
  @IsOptional()
  @IsArray()
  @IsEnum(RegimeTributario, { each: true })
  regimesAplicaveis?: RegimeTributario[];

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
