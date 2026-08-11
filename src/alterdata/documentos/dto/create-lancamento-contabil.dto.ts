import { IsNumber, IsString, Matches } from 'class-validator';

const NOME_ARQUIVO_REGEX =
  /^Lançamentos_contabeis_\d{2}_\d{2}_\d{4}_a_\d{2}_\d{2}_\d{4}\.txt$/;

/**
 * Envio de lançamentos contábeis via arquivo TXT (layout do Sistema
 * Contábil Windows), conforme seção "Integração Alterdata" da
 * documentação. O nome do arquivo precisa seguir o padrão
 * Lançamentos_contabeis_DD_MM_AAAA_a_DD_MM_AAAA.txt.
 */
export class CreateLancamentoContabilDto {
  @IsString()
  @Matches(NOME_ARQUIVO_REGEX, {
    message:
      'documento deve seguir o padrão "Lançamentos_contabeis_DD_MM_AAAA_a_DD_MM_AAAA.txt"',
  })
  documento!: string;

  @IsNumber()
  categoriaId!: number;

  /** CNPJ do remetente: 14 caracteres, aceita alfanumérico (A-Z nas 8 primeiras posições). */
  @IsString()
  @Matches(/^[0-9A-Za-z]{14}$/, {
    message: 'cnpjremetente deve ter 14 caracteres alfanuméricos',
  })
  cnpjremetente!: string;

  /** Conteúdo do arquivo TXT, em base64. */
  @IsString()
  arquivoBase64!: string;
}
