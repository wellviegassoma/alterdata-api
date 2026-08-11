import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateDesligamentoDto {
  @IsNumber()
  funcionarioId!: number;

  @IsNumber()
  empresaId!: number;

  /** id de tipos-documento-rescisao (ver GET /referencia/tipo-documento-rescisao) */
  @IsNumber()
  documentoRescisaoId!: number;

  /** id de tipos-aviso-previo (ver GET /referencia/tipo-aviso-previo) */
  @IsNumber()
  avisoPrevioId!: number;

  /** id de tipos-emissor (ver GET /referencia/tipo-emissor) */
  @IsNumber()
  emissorNotificacaoId!: number;

  /** id de tipos-desligamento (ver GET /referencia/tipo-desligamento) */
  @IsNumber()
  tipoDesligamentoId!: number;

  /** Data da solicitação de desligamento (ex.: '2023-08-01') */
  @IsDateString()
  solicitacao!: string;

  @IsOptional()
  @IsBoolean()
  simulacao?: boolean;
}
