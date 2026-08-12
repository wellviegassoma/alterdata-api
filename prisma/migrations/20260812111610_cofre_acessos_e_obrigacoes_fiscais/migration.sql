-- CreateEnum
CREATE TYPE "PeriodicidadeObrigacao" AS ENUM ('MENSAL', 'ANUAL');

-- CreateTable
CREATE TABLE "acessos_cliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "portal" TEXT NOT NULL,
    "login" TEXT,
    "senhaCifrada" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acessos_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_obrigacao_fiscal" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "periodicidade" "PeriodicidadeObrigacao" NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "mesVencimento" INTEGER,
    "regimesAplicaveis" "RegimeTributario"[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_obrigacao_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obrigacoes_cliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipoObrigacaoId" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "dataVencimento" DATE NOT NULL,
    "cumprida" BOOLEAN NOT NULL DEFAULT false,
    "cumpridaEm" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obrigacoes_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipos_obrigacao_fiscal_nome_key" ON "tipos_obrigacao_fiscal"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "obrigacoes_cliente_clienteId_tipoObrigacaoId_competencia_key" ON "obrigacoes_cliente"("clienteId", "tipoObrigacaoId", "competencia");

-- AddForeignKey
ALTER TABLE "acessos_cliente" ADD CONSTRAINT "acessos_cliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obrigacoes_cliente" ADD CONSTRAINT "obrigacoes_cliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obrigacoes_cliente" ADD CONSTRAINT "obrigacoes_cliente_tipoObrigacaoId_fkey" FOREIGN KEY ("tipoObrigacaoId") REFERENCES "tipos_obrigacao_fiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
