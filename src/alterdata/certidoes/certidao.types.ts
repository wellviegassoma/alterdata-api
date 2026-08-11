export interface CertidaoAttributes {
  empresaId: number;
  arquivo?: string;
  abrangencia?: string;
  mimeType?: string | null;
  emissao?: string;
  vencimento?: string;
  status?: string;
}

export interface TipoCertidaoAttributes {
  nome: string;
}
