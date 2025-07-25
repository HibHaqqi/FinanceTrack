-- Step 1: Add the transfer type to the TransactionType enum
ALTER TYPE "TransactionType" ADD VALUE 'transfer';

-- Step 2: Add the destinationWalletId column to the Transaction table
ALTER TABLE "Transaction" ADD COLUMN "destinationWalletId" TEXT;

-- Step 3: Add the userId column to the Category table (nullable initially)
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;

-- Step 4: Find or create a default user and update all categories
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    -- Get the first user ID
    SELECT id INTO default_user_id FROM "User" LIMIT 1;
    
    -- If no user exists, create a default admin user
    IF default_user_id IS NULL THEN
        INSERT INTO "User" (id, email, password, "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid(), 
            'admin@example.com', 
            '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', -- password: password123
            NOW(), 
            NOW()
        )
        RETURNING id INTO default_user_id;
    END IF;
    
    -- Update all categories with NULL userId to use the default user
    UPDATE "Category"
    SET "userId" = default_user_id
    WHERE "userId" IS NULL;
END $$;

-- Step 5: Make the userId column non-nullable
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

-- Step 6: Add a foreign key constraint to link Category to User
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 7: Create the name_userId unique constraint
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");

-- Step 8: Update all wallets with NULL userId to use the default user
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    -- Get the first user ID
    SELECT id INTO default_user_id FROM "User" LIMIT 1;
    
    -- Update all wallets with NULL userId to use the default user
    UPDATE "Wallet"
    SET "userId" = default_user_id
    WHERE "userId" IS NULL;
END $$;

-- Step 9: Make the userId column in Wallet non-nullable
ALTER TABLE "Wallet" ALTER COLUMN "userId" SET NOT NULL;