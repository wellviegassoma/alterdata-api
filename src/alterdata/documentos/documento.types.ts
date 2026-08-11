export interface DocumentoAttributes {
  empresaId: number;
  categoria?: string;
  valor?: number;
  titulo?: string;
  departamento?: string | null;
  vencimento?: string | null;
  expiracao?: string | null;
  criacao?: string;
  pagamento?: string | null;
  pago?: boolean;
  descricao?: string;
  status?: string;
}
