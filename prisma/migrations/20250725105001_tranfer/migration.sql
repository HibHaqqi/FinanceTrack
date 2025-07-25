-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'transfer';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "destinationWalletId" TEXT;
