import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDocumentoClienteDto {
  @IsString()
  clienteId!: string;

  @IsString()
  tipoDocumentoId!: string;

  @IsOptional()
  @IsDateString()
  dataEmissao?: string;

  @IsDateString()
  dataVencimento!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
