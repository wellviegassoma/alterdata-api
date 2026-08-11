import { registerAs } from '@nestjs/config';

export interface AlterdataBaseUrls {
  dp: string;
  atendimentos: string;
  cnd: string;
  documentos: string;
  identificacao: string;
  tarefas: string;
}

export interface AlterdataConfig {
  token: string;
  timeoutMs: number;
  baseUrls: AlterdataBaseUrls;
}

export default registerAs(
  'alterdata',
  (): AlterdataConfig => ({
    token: process.env.ALTERDATA_TOKEN ?? '',
    timeoutMs: Number(process.env.ALTERDATA_TIMEOUT_MS ?? 15000),
    baseUrls: {
      dp: process.env.ALTERDATA_DP_URL ?? 'https://dp.pack.alterdata.com.br',
      atendimentos:
        process.env.ALTERDATA_ATENDIMENTOS_URL ?? 'https://atendimentos.pack.alterdata.com.br',
      cnd: process.env.ALTERDATA_CND_URL ?? 'https://cnd.pack.alterdata.com.br',
      documentos:
        process.env.ALTERDATA_DOCUMENTOS_URL ?? 'https://documentos.pack.alterdata.com.br',
      identificacao:
        process.env.ALTERDATA_IDENTIFICACAO_URL ?? 'https://identificacao.pack.alterdata.com.br',
      tarefas: process.env.ALTERDATA_TAREFAS_URL ?? 'https://ms-tarefas.pack.alterdata.com.br',
    },
  }),
);
