import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovimentoDto {
  @IsNumber()
  empresaId!: number;

  @IsNumber()
  funcionarioId!: number;

  /** id de tipos-movimento (ver GET /referencia/tipo-movimento) */
  @IsNumber()
  tipoMovimentoId!: number;

  /** id do evento (folha/verba) cadastrado no eContador */
  @IsNumber()
  eventoId!: number;

  /** Quantidade/valor do movimento (ex.: '1:00' para horas, ou valor monetário conforme o evento) */
  @IsString()
  valor!: string;

  /** Início do período (ex.: '2023-08-01T03:00:00Z') */
  @IsDateString()
  inicio!: string;

  /** Fim do período (ex.: '2023-08-31T03:00:00Z') */
  @IsDateString()
  fim!: string;

  @IsOptional()
  @IsString()
  comentario?: string;

  /** Dias de falta associados ao movimento, quando aplicável */
  @IsOptional()
  @IsArray()
  faltas?: Array<{
    empresaId: string | number;
    funcionarioId: string | number;
    inicio: string;
    fim: string;
    dia: string;
  }>;
}
