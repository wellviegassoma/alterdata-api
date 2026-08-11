import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * Campos obrigatórios por padrão no ePlugin: nome, cpf, admissao, empresa
 * (relationship) e nomecargo. Os demais campos de dados pessoais/endereço/
 * contrato podem se tornar obrigatórios conforme a configuração de
 * "Campos Obrigatórios" em Configurações > Pré-admissão no eContador — por
 * isso ficam disponíveis em `atributosAdicionais`, sem validação rígida
 * aqui (o ePlugin retorna 400 se algo exigido pela config faltar).
 */
export class CreateAdmissaoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  cpf!: number;

  @IsOptional()
  @IsString()
  cpfAlfanumerico?: string;

  @IsOptional()
  @IsBoolean()
  isCpf?: boolean;

  @IsDateString()
  admissao!: string;

  @IsString()
  @IsNotEmpty()
  nomecargo!: string;

  @IsNumber()
  empresaId!: number;

  @IsOptional()
  @IsNumber()
  statusAdmissaoId?: number;

  @IsOptional()
  @IsNumber()
  estadoId?: number;

  @IsOptional()
  @IsNumber()
  estadoCivilId?: number;

  @IsOptional()
  @IsNumber()
  tipoVinculoTrabalhistaId?: number;

  @IsOptional()
  @IsNumber()
  naturalidadeId?: number;

  @IsOptional()
  @IsNumber()
  tipoContaId?: number;

  @IsOptional()
  @IsNumber()
  tipoAdmissaoId?: number;

  @IsOptional()
  @IsNumber()
  sexoId?: number;

  @IsOptional()
  @IsNumber()
  racaId?: number;

  @IsOptional()
  @IsNumber()
  escolaridadeId?: number;

  @IsOptional()
  @IsNumber()
  nacionalidadeId?: number;

  @IsOptional()
  @IsNumber()
  paisNascimentoId?: number;

  @IsOptional()
  @IsNumber()
  paisId?: number;

  @IsOptional()
  @IsNumber()
  departamentoId?: number;

  @IsOptional()
  @IsNumber()
  funcaoId?: number;

  @IsOptional()
  @IsNumber()
  formaPagamentoId?: number;

  @IsOptional()
  @IsNumber()
  categoriaWdpId?: number;

  @IsOptional()
  @IsNumber()
  tipoIdentidadeId?: number;

  @IsOptional()
  @IsNumber()
  ufIdentidadeId?: number;

  @IsOptional()
  @IsNumber()
  ufCtpsId?: number;

  @IsOptional()
  @IsNumber()
  ufCnhId?: number;

  @IsOptional()
  @IsNumber()
  categoriaCnhId?: number;

  @IsOptional()
  @IsNumber()
  fotoId?: number;

  /**
   * Demais atributos documentados (nascimento, endereço, salário, CTPS,
   * PIS, título de eleitor, vale-transporte, etc.), enviados como estão
   * para o campo `attributes` do JSON:API.
   */
  @IsOptional()
  @IsObject()
  atributosAdicionais?: Record<string, unknown>;
}
