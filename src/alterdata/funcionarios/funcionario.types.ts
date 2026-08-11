export interface FuncionarioAttributes {
  codigo: string;
  nome: string;
  status: string;
  afastamentodescricao?: string;
  dataAtualizacao?: string;
  nascimento?: string;
  cidade?: string;
  telefone?: string;
  telefonecelular?: string;
  numero?: number;
  carteiradetrabalho?: number;
  afastamento?: string | null;
  cep?: string;
  complemento?: string;
  cpf?: number;
  cpfAlfanumerico?: string;
  isCpf?: boolean;
  chavePix?: string;
  conta?: string;
  agencia?: string;
  nomeDoBanco?: string;
  banco?: number;
  externoid?: string;
  pis?: string;
  email?: string;
  demissao?: string | null;
  bairro?: string;
  rua?: string;
  nomefuncao?: string;
  identidade?: string;
  admissao?: string;
  retorno?: string | null;
  matriculaESocial?: string;
  [key: string]: unknown;
}

export interface HistoricoFuncaoAttributes {
  dataAlteracaoFuncao: string;
  externoId?: string;
  funcaoAtual: {
    id: number;
    externoid?: string;
    codigo: string;
    nome: string;
    cbo?: number;
  };
  funcaoAnterior?: {
    id: number;
    externoid?: string;
    codigo: string;
    nome: string;
    cbo?: number;
  };
}
