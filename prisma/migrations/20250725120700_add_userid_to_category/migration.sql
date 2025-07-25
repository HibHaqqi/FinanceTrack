-- Add the userId column to the Category table
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;

-- Add a foreign key constraint to link Category to User
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Find or create a default user and update all categories
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

-- Make the userId column non-nullable
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

-- Drop the existing unique constraint on name
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_name_key";

-- Create the name_userId unique constraint
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");