# alterdata-api

API de integração (NestJS + TypeScript) com o **ePlugin** da Alterdata — a camada de dados do
**eContador**, usada aqui como o primeiro módulo de um futuro sistema de gestão do escritório de
contabilidade. Documentação oficial: https://eplugin.pack.alterdata.com.br/

Esta API expõe endpoints REST simplificados (JSON comum) que, por baixo, conversam com o ePlugin
no padrão **JSON:API**, escondendo a complexidade de `type`/`id`/`relationships` do consumidor.

## ⚠️ Antes de usar

- É necessário ser cliente do pacote **eContador Master**.
- Gere o token em: eContador → **Configurações** → **ePlugin** → **Gerar**.
- **Os endpoints de escrita criam registros reais no eContador** (admissão, desligamento,
  agendamento de férias, atendimento, movimento de folha, lançamento contábil). Não existe
  ambiente de sandbox documentado — teste com cautela, de preferência numa empresa/funcionário de
  teste.

## Setup

```bash
npm install
cp .env.example .env
# edite o .env: defina ALTERDATA_TOKEN e DATABASE_URL (Postgres do Supabase)
npx prisma migrate deploy   # aplica as migrations no banco
# defina também JWT_SECRET, JWT_EXPIRES_IN e ADMIN_NOME/ADMIN_EMAIL/ADMIN_SENHA no .env
npm run db:seed             # cria o primeiro usuário ADMIN
npm run build && node dist/main.js
```

A API sobe em `http://localhost:3000/api`.

> Nota sobre `--watch`: se a pasta do projeto estiver sincronizada pelo OneDrive (comum em
> `Documents/`), o `npm run start:dev` pode entrar num loop de recompilação, porque o
> OneDrive toca nos arquivos em segundo plano e o watcher interpreta isso como mudança de
> código. Se isso acontecer, prefira rodar `npm run build && node dist/main.js` (sem watch)
> durante o desenvolvimento, ou mova o projeto para uma pasta fora do OneDrive.

### Banco de dados (Supabase Postgres + Prisma)

O eContador não expõe tudo que um cadastro de cliente de escritório contábil precisa (contato,
endereço estruturado, contrato/honorários, responsável interno, etc.). Esses dados extras ficam
num Postgres próprio (Supabase), acessado via Prisma, e ligados ao cadastro do eContador pelo
CNPJ/CPF (`cpfCnpjAlfanumerico`).

- Connection string: Supabase → botão **Connect** no topo do projeto → **Session pooler** → cole
  em `DATABASE_URL` no `.env`. Use o Session pooler (não "Direct connection") em hosts sem saída
  IPv6 como Railway/Render — a Direct connection do Supabase só responde em IPv6 por padrão e dá
  erro `P1001: Can't reach database server` nesses provedores.
- Prisma 7 exige um *driver adapter* para conectar (não usa mais engine embutida) — já
  configurado em [`src/prisma/prisma.service.ts`](src/prisma/prisma.service.ts) via
  `@prisma/adapter-pg`.
- Mudou o schema (`prisma/schema.prisma`)? Rode `npx prisma migrate dev --name <descrição>` em
  desenvolvimento (cria e aplica a migration) ou `npx prisma migrate deploy` em produção (só
  aplica as já existentes).

## Estrutura

```
src/
  config/alterdata.config.ts        # token + base URLs dos 6 microsserviços
  prisma/                           # PrismaService (conexão com Supabase via driver adapter)
  clientes/                         # cadastro de cliente: dados locais + merge com eContador
  alterdata/
    client/                         # cliente HTTP JSON:API compartilhado
      alterdata-http.service.ts     #   - injeta Authorization: Bearer TOKEN
      json-api.types.ts             #   - helpers de relationships/JSON:API
      alterdata-api.exception.ts    #   - mapeia erros 400/401/404/422
    lookups/                        # GET genérico de tipos-* + tabelas estáticas
    empresas/        funcionarios/  admissoes/       ferias/
    desligamentos/    folha-pagamento/  atendimentos/  categorias/
    certidoes/         documentos/       etarefas/      usuarios/
```

Cada pasta de feature segue o padrão `*.controller.ts` / `*.service.ts` / `*.module.ts`
(+ `dto/` quando há escrita), todos registrados em `alterdata/alterdata.module.ts`.

## Endpoints

Prefixo `/api` omitido abaixo por brevidade.

### Leitura

| Método | Rota | Alterdata |
|---|---|---|
| GET | `/empresas` | Consulta de Empresas |
| GET | `/empresas/:id` | Consulta de Empresa por Id (id sequencial do dp.pack) |
| GET | `/empresas/:cnpj/simplificada` | Consulta de Empresa por Id Simplificada (id = CNPJ; traz `nomeFantasia`/`codigo`) |
| GET | `/empresas/:id/completa` | Mescla os dois endpoints acima numa visão só |
| GET | `/funcionarios` | Consulta de Funcionários |
| GET | `/funcionarios/:id` | Consulta de Funcionário por Id |
| GET | `/funcionarios/:id/historico-funcoes` | Histórico de Funções |
| GET | `/categorias?login=` | Consulta de Categorias de documento |
| GET | `/certidoes?empresaId=` | Consulta de Certidões |
| GET | `/certidoes/:id?empresaId=` | Consulta de Certidão por Id |
| GET | `/certidoes/tipos` | Consulta de Tipos de Certidão |
| GET | `/certidoes/tipos/:id` | Consulta de Tipo de Certidão por Id |
| GET | `/documentos?empresaId=` | Consulta de Documentos |
| GET | `/documentos/:id?empresaId=` | Consulta de Documento por Id |
| GET | `/etarefas/historico?dataInicial=&dataFinal=` | Histórico de Tarefas |
| GET | `/usuarios` | Todos os Usuários Clientes |
| GET | `/usuarios/:id` | Usuário por Id (CPF/CNPJ) |
| GET | `/usuarios/vertical` | Vertical do cliente |
| GET | `/lookups/:type` | Dados de referência (tipos-estado-civil, estados, ...) |
| GET | `/lookups/:type/:id` | Item de referência por id |
| GET | `/referencia` | Tabelas estáticas disponíveis (Estado, Banco, etc.) |
| GET | `/referencia/:tabela` | Conteúdo de uma tabela estática |

### Escrita (⚠️ cria dados reais no eContador)

| Método | Rota | Alterdata |
|---|---|---|
| POST | `/admissoes` | Inclusão de Admissão |
| POST | `/ferias/agendamentos` | Inclusão de Agendamento de Férias |
| POST | `/desligamentos` | Realizar Desligamento (pré-demissão) |
| POST | `/folha-pagamento/movimentos` | Inclusão de valores na Folha de Pagamento |
| POST | `/atendimentos` | Inclusão de Atendimento |
| POST | `/documentos/lancamentos-contabeis` | Integração Alterdata (arquivo TXT de lançamentos) |

## Autenticação

Toda rota exige `Authorization: Bearer <JWT>` por padrão — **exceto** as marcadas com `@Public()`
(`GET /api` health check e `POST /api/auth/login`). Isso é aplicado globalmente por um
`JwtAuthGuard` (ver `src/auth/`), então novos módulos/rotas já nascem protegidos sem precisar
lembrar de nada.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | `{ email, senha }` → `{ accessToken, usuario }` |
| GET | `/auth/me` | Autenticado | Dados do usuário do token atual |
| POST | `/usuarios-internos` | Só ADMIN | Cria usuário do escritório |
| GET | `/usuarios-internos` | Só ADMIN | Lista usuários do escritório |
| PATCH/DELETE | `/usuarios-internos/:id` | Só ADMIN | Edita/remove usuário |

Papéis (`Usuario.papel`): `ADMIN`, `CONTADOR`, `ANALISTA`. Novas rotas que devem ser restritas a
um papel usam o decorator `@Roles(PapelUsuario.ADMIN)` (importado de `@prisma/client`).

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "seu@email.com", "senha": "sua-senha"}'

# usa o accessToken retornado:
curl http://localhost:3000/api/empresas -H "Authorization: Bearer <TOKEN>"
```

## Módulo Clientes (dados locais + eContador)

Cadastro de cliente do escritório, guardado no Supabase e mesclado com os dados do eContador
pelo CNPJ/CPF. `alterdataEmpresaId` (id sequencial do dp.pack) é opcional mas recomendado — sem
ele, a visão completa cai para os poucos campos do endpoint simplificado (nome, nome fantasia,
código).

| Método | Rota | Descrição |
|---|---|---|
| POST | `/clientes` | Cria cliente local (contato, endereço, dados fiscais, contrato, tags) |
| GET | `/clientes` | Lista clientes locais (`?status=&skip=&take=`) |
| GET | `/clientes/:cnpjCpf` | Cliente local por CNPJ/CPF |
| GET | `/clientes/:cnpjCpf/completo` | **Visão consolidada**: `{ econtador, local }` |
| PATCH | `/clientes/:cnpjCpf` | Atualiza campos locais (contatos/tags enviados substituem a lista inteira) |
| DELETE | `/clientes/:cnpjCpf` | Remove o cliente local (não afeta o cadastro no eContador) |

```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpjCpf": "38038944000120",
    "alterdataEmpresaId": "1",
    "status": "ATIVO",
    "contatos": [{"nome": "Maria Souza", "email": "maria@cliente.com.br", "principal": true}],
    "endereco": {"cep": "20000-000", "cidade": "Rio de Janeiro", "uf": "RJ"},
    "dadosFiscais": {"regimeTributario": "SIMPLES_NACIONAL"},
    "contrato": {"valorHonorarios": 850.00, "diaVencimento": 10, "status": "ATIVO"},
    "tags": ["varejo", "prioritario"]
  }'

curl http://localhost:3000/api/clientes/38038944000120/completo
```

## Exemplo: consultar empresas

```bash
curl http://localhost:3000/api/empresas -H "Content-Type: application/json"
```

## Exemplo: criar uma admissão

Os campos de relationship (empresa, estado civil, tipo de vínculo, etc.) são enviados como
`*Id` simples — o serviço monta a estrutura JSON:API internamente.

```bash
curl -X POST http://localhost:3000/api/admissoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Sergio Mendes",
    "cpf": 13268843794,
    "admissao": "2025-01-01",
    "nomecargo": "Analista",
    "empresaId": 1,
    "estadoCivilId": 1,
    "tipoVinculoTrabalhistaId": 10
  }'
```

## Dados de referência

Os ids usados em relationships (estado civil, tipo de desligamento, banco, etc.) vêm de duas
fontes:

- **Tabelas fixas** documentadas pela Alterdata → `GET /api/referencia` e
  `GET /api/referencia/:tabela` (ex.: `tipo-desligamento`, `tipo-banco`, `estados`).
- **Dados específicos da conta** (departamentos, funções, eventos, operadores) → consultados via
  `GET /api/lookups/:type` (ex.: `GET /api/lookups/tipos-estado-civil`), que faz proxy para
  `dp.pack.alterdata.com.br/api/v1/:type`.

## Erros

Falhas do ePlugin são repassadas como `AlterdataApiException`, preservando o status HTTP original
(400 campo obrigatório ausente, 401 token inválido/expirado, 422 formato de dado inválido) e o
corpo de erro retornado pela Alterdata em `upstreamBody`.

## Próximos passos

- **Autenticação/autorização própria** (login com e-mail/senha + papéis) — necessária antes de
  expor a API na nuvem para o escritório e home office acessarem. O modelo `Usuario` já existe no
  schema do Prisma, falta o módulo de auth (JWT) em cima dele.
- Deploy do backend (Railway/Render) com `ALTERDATA_TOKEN` e `DATABASE_URL` como variáveis de
  ambiente secretas.
- Novos módulos do sistema de gestão (financeiro, tarefas internas, etc.) seguem o mesmo padrão:
  módulos Nest irmãos de `alterdata/`/`clientes/`, reaproveitando `AlterdataHttpService` e
  `PrismaService` conforme precisarem.
