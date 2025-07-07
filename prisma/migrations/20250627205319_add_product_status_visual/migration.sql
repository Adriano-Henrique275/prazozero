-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ATIVO', 'VENCIDO', 'REMOVIDO');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "removalReason" TEXT,
ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ATIVO';
