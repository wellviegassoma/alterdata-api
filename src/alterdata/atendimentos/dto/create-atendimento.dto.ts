import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAtendimentoDto {
  @IsString()
  descricao!: string;

  /** id de integracao/departamentos-do-bureau */
  @IsNumber()
  departamentoId!: number;

  @IsNumber()
  empresaId!: number;

  /** Prazo para providenciar ("Providenciar até") */
  @IsDateString()
  previsao!: string;

  /** Parecer inicial (texto obrigatório) */
  @IsString()
  parecerTexto!: string;

  @IsOptional()
  @IsDateString()
  parecerData?: string;

  @IsOptional()
  @IsNumber()
  operadorId?: number;

  @IsOptional()
  @IsNumber()
  abridorId?: number;

  @IsOptional()
  @IsBoolean()
  aberto?: boolean;

  @IsOptional()
  @IsBoolean()
  abertoNaWeb?: boolean;
}
