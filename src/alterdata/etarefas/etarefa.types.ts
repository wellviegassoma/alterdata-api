/**
 * Diferente dos demais endpoints, o histórico de tarefas NÃO retorna
 * envelope JSON:API — a resposta é um array plano de objetos.
 */
export interface HistoricoTarefaItem {
  nome: string;
  prazoEntrega: string;
  prazoLegal: string;
  responsavel: string;
  status: string;
  dataConclusao: string | null;
  empresa: string;
  departamento: string;
}
