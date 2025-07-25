-- Add the transfer type to the TransactionType enum
ALTER TYPE "TransactionType" ADD VALUE 'transfer';

-- Add the destinationWalletId column to the Transaction table
ALTER TABLE "Transaction" ADD COLUMN "destinationWalletId" TEXT;