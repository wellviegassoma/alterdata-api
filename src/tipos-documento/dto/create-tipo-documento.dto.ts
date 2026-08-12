import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTipoDocumentoDto {
  @IsString()
  nome!: string;

  /** Informativo, ex.: 12 = renovação anual, 6 = semestral. */
  @IsOptional()
  @IsInt()
  @Min(1)
  periodicidadeMeses?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
