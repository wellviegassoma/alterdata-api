export interface EmpresaAttributes {
  nome: string;
  ativa: boolean;
  /** CNPJ numérico legado (0 quando o CNPJ é alfanumérico). */
  cpfcnpj: number;
  /** CNPJ alfanumérico (14 chars, aceita letras A-Z nas 8 primeiras posições). */
  cpfCnpjAlfanumerico: string;
  isCpf: boolean;
  endereco?: string;
  externoid?: string;
  tipoMovimentoPermitido?: string;
  controlaTransferenciaTomadores?: boolean;
}

/** Retornado por GET /api/v1/integracao/empresas/{id} (identificacao.pack) — "versão simplificada". */
export interface EmpresaSimplificadaAttributes {
  codigo: string;
  nomeFantasia: string;
  nome: string;
  cpfCnpjAlfanumerico: string;
}
