-- CreateEnum
CREATE TYPE "StatusCliente" AS ENUM ('ATIVO', 'EM_ONBOARDING', 'EM_OFFBOARDING', 'INATIVO');

-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'ISENTO');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('ATIVO', 'SUSPENSO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('ADMIN', 'CONTADOR', 'ANALISTA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "PapelUsuario" NOT NULL DEFAULT 'CONTADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "cnpjCpf" TEXT NOT NULL,
    "alterdataEmpresaId" TEXT,
    "status" "StatusCliente" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "responsavelInternoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dados_fiscais" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "regimeTributario" "RegimeTributario",
    "cnaePrincipal" TEXT,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,

    CONSTRAINT "dados_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "valorHonorarios" DECIMAL(10,2),
    "diaVencimento" INTEGER,
    "formaPagamento" TEXT,
    "dataInicio" DATE,
    "status" "StatusContrato" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_tags" (
    "clienteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "cliente_tags_pkey" PRIMARY KEY ("clienteId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpjCpf_key" ON "clientes"("cnpjCpf");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_clienteId_key" ON "enderecos"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "dados_fiscais_clienteId_key" ON "dados_fiscais"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_clienteId_key" ON "contratos"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_nome_key" ON "tags"("nome");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_responsavelInternoId_fkey" FOREIGN KEY ("responsavelInternoId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dados_fiscais" ADD CONSTRAINT "dados_fiscais_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_tags" ADD CONSTRAINT "cliente_tags_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_tags" ADD CONSTRAINT "cliente_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
