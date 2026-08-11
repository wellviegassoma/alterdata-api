import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum StatusClienteDto {
  ATIVO = 'ATIVO',
  EM_ONBOARDING = 'EM_ONBOARDING',
  EM_OFFBOARDING = 'EM_OFFBOARDING',
  INATIVO = 'INATIVO',
}

export enum RegimeTributarioDto {
  MEI = 'MEI',
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  LUCRO_PRESUMIDO = 'LUCRO_PRESUMIDO',
  LUCRO_REAL = 'LUCRO_REAL',
  ISENTO = 'ISENTO',
}

export enum StatusContratoDto {
  ATIVO = 'ATIVO',
  SUSPENSO = 'SUSPENSO',
  ENCERRADO = 'ENCERRADO',
}

export class ContatoDto {
  @IsString()
  nome!: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}

export class EnderecoDto {
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  rua?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  uf?: string;
}

export class DadosFiscaisDto {
  @IsOptional()
  @IsEnum(RegimeTributarioDto)
  regimeTributario?: RegimeTributarioDto;

  @IsOptional()
  @IsString()
  cnaePrincipal?: string;

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;
}

export class ContratoDto {
  @IsOptional()
  @IsNumber()
  valorHonorarios?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  diaVencimento?: number;

  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsEnum(StatusContratoDto)
  status?: StatusContratoDto;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

/**
 * cnpjCpf é a chave estável que liga este registro ao cadastro da empresa
 * no eContador (mesmo valor do cpfCnpjAlfanumerico retornado pela Alterdata).
 * alterdataEmpresaId (id sequencial do dp.pack) é opcional mas recomendado:
 * evita ter que localizar a empresa por busca depois, na visão consolidada.
 */
export class CreateClienteDto {
  @IsString()
  cnpjCpf!: string;

  @IsOptional()
  @IsString()
  alterdataEmpresaId?: string;

  /** Cache do nome (razão social) vindo do eContador, para listagens rápidas. */
  @IsOptional()
  @IsString()
  nome?: string;

  /** Cache do nome fantasia vindo do eContador. */
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsOptional()
  @IsEnum(StatusClienteDto)
  status?: StatusClienteDto;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsString()
  responsavelInternoId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DadosFiscaisDto)
  dadosFiscais?: DadosFiscaisDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContratoDto)
  contrato?: ContratoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContatoDto)
  contatos?: ContatoDto[];

  /** Nomes de tags livres; tags novas são criadas automaticamente. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
