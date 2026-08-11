/**
 * Cada valor corresponde a um dos microsserviços do ePlugin (Alterdata),
 * cada um com sua própria base URL configurada em alterdata.config.ts.
 */
export enum AlterdataService {
  DP = 'dp',
  ATENDIMENTOS = 'atendimentos',
  CND = 'cnd',
  DOCUMENTOS = 'documentos',
  IDENTIFICACAO = 'identificacao',
  TAREFAS = 'tarefas',
}
