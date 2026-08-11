import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAgendamentoFeriasDto {
  @IsNumber()
  funcionarioId!: number;

  /** Período De (ex.: '2025-02-01') */
  @IsDateString()
  de!: string;

  /** Período Até (ex.: '2025-01-01') */
  @IsDateString()
  ate!: string;

  @IsBoolean()
  adiantamentodecimoterceiro!: boolean;

  /** Data/hora da solicitação (ex.: '2023-08-08T15:48:59.335Z') */
  @IsDateString()
  solicitacao!: string;

  /** id de tipos-status-agendamento (ver GET /referencia/status-agendamento) */
  @IsNumber()
  statusId!: number;

  @IsOptional()
  @IsNumber()
  abonodias?: number;

  @IsOptional()
  @IsString()
  anotacoes?: string;
}
