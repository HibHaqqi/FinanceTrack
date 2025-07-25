-- Add the userId column to the Category table (nullable initially)
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;

-- Create the name_userId unique constraint
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");