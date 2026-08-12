import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateObrigacaoClienteDto {
  @IsOptional()
  @IsDateString()
  dataVencimento?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  cumprida?: boolean;
}
