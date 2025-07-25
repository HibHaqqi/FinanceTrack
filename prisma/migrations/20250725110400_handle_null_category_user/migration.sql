-- First, we need to find a default user to assign to existing categories
-- This will use the first user in the database as the default
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

-- Now make the userId column non-nullable
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;