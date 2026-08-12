/*
  Warnings:

  - You are about to drop the column `responsavelInternoId` on the `clientes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_responsavelInternoId_fkey";

-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "responsavelInternoId",
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "responsavelContabilId" TEXT,
ADD COLUMN     "responsavelDpId" TEXT,
ADD COLUMN     "responsavelFiscalId" TEXT;

-- AlterTable
ALTER TABLE "dados_fiscais" ADD COLUMN     "capitalSocial" DECIMAL(14,2),
ADD COLUMN     "dataAbertura" DATE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_responsavelFiscalId_fkey" FOREIGN KEY ("responsavelFiscalId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_responsavelContabilId_fkey" FOREIGN KEY ("responsavelContabilId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_responsavelDpId_fkey" FOREIGN KEY ("responsavelDpId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
