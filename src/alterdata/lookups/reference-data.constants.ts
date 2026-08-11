/**
 * Tabelas de referência estáticas, copiadas da seção "Estruturas de Dados"
 * da documentação do ePlugin (https://eplugin.pack.alterdata.com.br/).
 * Diferente dos lookups em LookupsService (que fazem GET na API), estas
 * são fixas e não exigem chamada de rede.
 */

export const STATUS_ADMISSAO = {
  0: 'Pendente',
  1: 'Analise',
  2: 'Aguardando Cliente',
  3: 'Cadastrado',
  4: 'Cancelado',
  5: 'A concluir',
} as const;

export const ESTADOS = {
  1: { nome: 'Acre', sigla: 'AC' },
  2: { nome: 'Alagoas', sigla: 'AL' },
  3: { nome: 'Amapá', sigla: 'AP' },
  4: { nome: 'Amazonas', sigla: 'AM' },
  5: { nome: 'Bahia', sigla: 'BA' },
  6: { nome: 'Ceará', sigla: 'CE' },
  7: { nome: 'Distrito Federal', sigla: 'DF' },
  8: { nome: 'Espírito Santo', sigla: 'ES' },
  9: { nome: 'Goiás', sigla: 'GO' },
  10: { nome: 'Maranhão', sigla: 'MA' },
  11: { nome: 'Mato Grosso', sigla: 'MT' },
  12: { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  13: { nome: 'Minas Gerais', sigla: 'MG' },
  14: { nome: 'Pará', sigla: 'PA' },
  15: { nome: 'Paraíba', sigla: 'PB' },
  16: { nome: 'Paraná', sigla: 'PR' },
  17: { nome: 'Pernambuco', sigla: 'PE' },
  18: { nome: 'Piauí', sigla: 'PI' },
  19: { nome: 'Roraima', sigla: 'RR' },
  20: { nome: 'Rondônia', sigla: 'RO' },
  21: { nome: 'Rio de Janeiro', sigla: 'RJ' },
  22: { nome: 'Rio Grande do Norte', sigla: 'RN' },
  23: { nome: 'Rio Grande do Sul', sigla: 'RS' },
  24: { nome: 'Santa Catarina', sigla: 'SC' },
  25: { nome: 'São Paulo', sigla: 'SP' },
  26: { nome: 'Sergipe', sigla: 'SE' },
  27: { nome: 'Tocantins', sigla: 'TO' },
} as const;

export const ESTADO_CIVIL = {
  1: 'Solteiro',
  2: 'Casado',
  3: 'Divorciado',
  4: 'Viúvo',
  5: 'União Estável',
  6: 'Outros',
} as const;

export const VINCULO_TRABALHISTA = {
  10: 'Trabalhador urbano vinculado a empregador pessoa jurídica por contrato de trabalho regido pela CLT por prazo indeterminado',
  15: 'Trabalhador urbano vinculado a empregador pessoa física por contrato de trabalho regido pela CLT por prazo indeterminado',
  20: 'Trabalhador rural vinculado a empregador pessoa jurídica por contrato de trabalho regido pela Lei nº 5.889/73 por prazo indeterminado',
  25: 'Trabalhador rural vinculado a empregador pessoa física por contrato de trabalho regido pela Lei nº 5.889/73 por prazo indeterminado',
  30: 'Servidor regido pelo Regime Jurídico Único (federal, estadual e municipal) e militar',
  31: 'Servidor regido pelo Regime Jurídico Único (federal, estadual e municipal) e militar, vinculado ao Regime Geral da Previdência Social',
  35: 'Servidor público não-efetivo (demissível ad nutum ou admitido por legislação especial), não regido pela CLT',
  40: 'Trabalhador avulso (trabalho administrado pelo sindicato da categoria ou pelo órgão gestor de mão-de-obra) para o qual é devido depósito de FGTS - CF 88, art. 7, inciso III',
  50: 'Trabalhador temporário, regido pela Lei nº 6.019 de 03/01/74',
  55: 'Menor aprendiz',
  60: 'Trabalhador urbano vinculado a empregador pessoa jurídica por contrato de trabalho regido pela CLT, por tempo determinado ou obra certa',
  65: 'Trabalhador urbano vinculado a empregador pessoa física por contrato de trabalho regido pela CLT, por tempo determinado ou obra certa',
  70: 'Trabalhador rural vinculado a empregador pessoa jurídica por contrato de trabalho regido pela Lei nº 5.889/73, por prazo determinado',
  75: 'Trabalhador rural vinculado a empregador pessoa física por contrato de trabalho regido pela Lei nº 5.889/73, por prazo determinado',
  80: 'Diretor sem vínculo empregatício para o qual a empresa/entidade tenha optado por recolhimento ao FGTS',
  90: 'Contrato de Trabalho por Prazo Determinado, regido pela Lei nº 9.601 de 21/01/98',
  95: 'Contrato de Trabalho por Tempo Determinado, regido pela Lei nº 8.745, de 9 de dezembro de 1993, com redação dada pela Lei nº 9.849, de 26 de outubro de 1999',
  96: 'Contrato de Trabalho por Tempo Determinado, regido por Lei Estadual',
} as const;

export const TIPO_CONTA = {
  1: 'Conta Corrente',
  2: 'Poupança',
  3: 'Conta Salário',
  4: 'Não Possui',
} as const;

export const TIPO_ADMISSAO = {
  1: 'Admissão',
  2: 'Transferência',
  3: 'Sucessão',
  4: 'Cessão',
} as const;

export const STATUS_AGENDAMENTO = {
  1: 'Aguardando Liberação',
  2: 'Aguardando Importação',
  3: 'Aguardando Confirmação',
  4: 'Confirmado',
  5: 'Confirmado com Observações',
  6: 'Férias Processadas',
  7: 'Excluído',
  8: 'Cancelado',
} as const;

export const TIPO_EMISSOR = {
  1: 'Empregado',
  2: 'Empresa',
} as const;

export const TIPO_DOCUMENTO_RESCISAO = {
  1: 'Aviso prévio',
  2: 'Comunicado de dispensa',
} as const;

export const TIPO_AVISO_PREVIO = {
  1: 'Trabalhado',
  2: 'Indenizado',
  3: 'Dispensa de aviso',
} as const;

export const TIPO_DESLIGAMENTO = {
  10: 'Desligar o funcionário com justa causa',
  11: 'Desligar o funcionário sem justa causa',
  12: 'Término de contrato do funcionário',
  20: 'Pedido de demissão com justa causa (Rescisão indireta)',
  21: 'Pedido de demissão sem justa causa ou exoneração a pedido',
  30: 'Transferência/movimentação do empregado/servidor entre estabelecimentos da mesma empresa/entidade, ou para outra empresa/entidade, com ônus para a cedente',
  31: 'Transferência/movimentação do empregado/servidor ou dirigente sindical entre estabelecimentos da mesma empresa/entidade, ou para outra empresa/entidade, sem ônus para a cedente',
  33: 'Rescisão por acordo entre as partes',
  40: 'Mudança de regime trabalhista',
  41: 'Rescisão do contrato de aprendizagem por desempenho insuficiente ou inadaptação do aprendiz',
  44: 'Agrupamento contratual',
  50: 'Reforma de militar para a reserva remunerada',
  60: 'Falecimento',
  62: 'Falecimento decorrente de acidente do trabalho típico',
  63: 'Falecimento decorrente de acidente do trabalho de trajeto',
  64: 'Falecimento decorrente de doença profissional',
  70: 'Aposentadoria por tempo de serviço, com rescisão contratual',
  71: 'Aposentadoria por tempo de serviço, sem rescisão contratual',
  72: 'Aposentadoria por idade, com rescisão contratual',
  73: 'Aposentadoria por invalidez, decorrente de acidente do trabalho',
  74: 'Aposentadoria por invalidez, decorrente de doença profissional',
  75: 'Aposentadoria compulsória',
  76: 'Aposentadoria por invalidez, exceto a decorrente de doença profissional ou acidente do trabalho',
  78: 'Aposentadoria por idade, sem rescisão contratual',
  79: 'Aposentadoria especial, com rescisão do contrato',
  80: 'Aposentadoria especial, sem rescisão do contrato',
} as const;

export const TIPO_MOVIMENTO = {
  1: 'Folha',
  2: 'Férias',
  3: 'Rescisão',
  4: 'Adiantamento',
  5: '1° parcela do 13º',
  6: '2° parcela do 13º',
} as const;

export const STATUS_TAREFAS = {
  1: 'A fazer',
  2: 'Concluído',
  5: 'Atrasada',
  6: 'Risco de multas',
  7: 'Enviado',
} as const;

export const TIPO_CATEGORIA = {
  1: 'Lançamento Contábil',
} as const;

/** Bancos (código FEBRABAN -> nome), conforme tabela "Tipo Banco" da documentação. */
export const TIPO_BANCO: Record<string, string> = {
  '246': 'Banco ABC Brasil S.A.',
  '075': 'Banco ABN AMRO S.A.',
  '121': 'Banco Agibank S.A.',
  '025': 'Banco Alfa S.A.',
  '065': 'Banco Andbank (Brasil) S.A.',
  '096': 'Banco B3 S.A.',
  '024': 'Banco BANDEPE S.A.',
  '318': 'Banco BMG S.A.',
  '752': 'Banco BNP Paribas Brasil S.A.',
  '107': 'Banco BOCOM BBM S.A.',
  '237': 'Banco Bradesco S.A.',
  '218': 'Banco BS2 S.A.',
  '208': 'Banco BTG Pactual S.A.',
  '336': 'Banco C6 S.A.',
  '473': 'Banco Caixa Geral - Brasil S.A.',
  '040': 'Banco Cargill S.A.',
  '739': 'Banco Cetelem S.A.',
  '233': 'Banco Cifra S.A.',
  '745': 'Banco Citibank S.A.',
  '756': 'Banco Cooperativo do Brasil S.A. - BANCOOB',
  '748': 'Banco Cooperativo Sicredi S.A.',
  '222': 'Banco Credit Agricole Brasil S.A.',
  '505': 'Banco Credit Suisse (Brasil) S.A.',
  '368': 'Banco CSF S.A.',
  '003': 'Banco da Amazônia S.A.',
  '083': 'Banco da China Brasil S.A.',
  '707': 'Banco Daycoval S.A.',
  '654': 'Banco Digimais S.A.',
  '335': 'Banco Digio S.A.',
  '001': 'Banco do Brasil S.A.',
  '047': 'Banco do Estado de Sergipe S.A.',
  '037': 'Banco do Estado do Pará S.A.',
  '041': 'Banco do Estado do Rio Grande do Sul S.A.',
  '004': 'Banco do Nordeste do Brasil S.A.',
  '224': 'Banco Fibra S.A.',
  '094': 'Banco Finaxis S.A.',
  '612': 'Banco Guanabara S.A.',
  '012': 'Banco Inbursa S.A.',
  '604': 'Banco Industrial do Brasil S.A.',
  '653': 'Banco Indusval S.A.',
  '077': 'Banco Inter S.A.',
  '376': 'Banco J. P. Morgan S.A.',
  '074': 'Banco J. Safra S.A.',
  '217': 'Banco John Deere S.A.',
  '600': 'Banco Luso Brasileiro S.A.',
  '243': 'Banco Máxima S.A.',
  '389': 'Banco Mercantil do Brasil S.A.',
  '370': 'Banco Mizuho do Brasil S.A.',
  '746': 'Banco Modal S.A.',
  '456': 'Banco MUFG Brasil S.A.',
  '212': 'Banco Original S.A.',
  '623': 'Banco PAN S.A.',
  '611': 'Banco Paulista S.A.',
  '643': 'Banco Pine S.A.',
  '747': 'Banco Rabobank International Brasil S.A.',
  '633': 'Banco Rendimento S.A.',
  '120': 'Banco Rodobens S.A.',
  '422': 'Banco Safra S.A.',
  '033': 'Banco Santander (Brasil) S.A.',
  '743': 'Banco Semear S.A.',
  '276': 'Banco Senff S.A.',
  '630': 'Banco Smartbank S.A.',
  '366': 'Banco Société Générale Brasil S.A.',
  '299': 'Banco Sorocred S.A. - Banco Múltiplo (AFINZ)',
  '464': 'Banco Sumitomo Mitsui Brasileiro S.A.',
  '082': 'Banco Topázio S.A.',
  '634': 'Banco Triângulo S.A.',
  '655': 'Banco Votorantim S.A.',
  '610': 'Banco VR S.A.',
  '119': 'Banco Western Union do Brasil S.A.',
  '102': 'Banco XP S.A.',
  '021': 'BANESTES S.A. Banco do Estado do Espírito Santo',
  '755': 'Bank of America Merrill Lynch Banco Múltiplo S.A.',
  '250': 'BCV - Banco de Crédito e Varejo S.A.',
  '144': 'BEXS Banco de Câmbio S.A.',
  '017': 'BNY Mellon Banco S.A.',
  '070': 'BRB - Banco de Brasília S.A.',
  '104': 'Caixa Econômica Federal',
  '320': 'China Construction Bank (Brasil) Banco Múltiplo S.A.',
  '477': 'Citibank N.A.',
  '487': 'Deutsche Bank S.A. - Banco Alemão',
  '062': 'Hipercard Banco Múltiplo S.A.',
  '269': 'HSBC Brasil S.A. - Banco de Investimento',
  '492': 'ING Bank N.V.',
  '341': 'Itaú Unibanco S.A.',
  '488': 'JPMorgan Chase Bank',
  '399': 'Kirton Bank S.A. - Banco Múltiplo',
  '128': 'MS Bank S.A. Banco de Câmbio',
  '254': 'Paraná Banco S.A.',
  '125': 'Plural S.A. - Banco Múltiplo',
  '751': 'Scotiabank Brasil S.A. Banco Múltiplo',
  '095': 'Travelex Banco de Câmbio S.A.',
  '129': 'UBS Brasil Banco de Investimento S.A.',
  '260': 'Nu Pagamentos S.A.',
};

export const REFERENCE_TABLES = {
  'status-admissao': STATUS_ADMISSAO,
  estados: ESTADOS,
  'estado-civil': ESTADO_CIVIL,
  'vinculo-trabalhista': VINCULO_TRABALHISTA,
  'tipo-conta': TIPO_CONTA,
  'tipo-banco': TIPO_BANCO,
  'tipo-admissao': TIPO_ADMISSAO,
  'status-agendamento': STATUS_AGENDAMENTO,
  'tipo-emissor': TIPO_EMISSOR,
  'tipo-documento-rescisao': TIPO_DOCUMENTO_RESCISAO,
  'tipo-aviso-previo': TIPO_AVISO_PREVIO,
  'tipo-desligamento': TIPO_DESLIGAMENTO,
  'tipo-movimento': TIPO_MOVIMENTO,
  'status-tarefas': STATUS_TAREFAS,
  'tipo-categoria': TIPO_CATEGORIA,
} as const;

export type ReferenceTableName = keyof typeof REFERENCE_TABLES;
