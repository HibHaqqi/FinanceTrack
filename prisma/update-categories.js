// This script updates existing categories with a userId
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCategories() {
  try {
    console.log('Starting category update...');
    
    // Find categories without userId
    const categoriesWithoutUser = await prisma.category.findMany({
      where: {
        userId: null
      }
    });
    
    if (categoriesWithoutUser.length === 0) {
      console.log('No categories found without userId');
      return;
    }
    
    console.log(`Found ${categoriesWithoutUser.length} categories without userId`);
    
    // Find or create a default user
    let defaultUser = await prisma.user.findFirst();
    
    if (!defaultUser) {
      console.log('No users found, creating a default user');
      // Create a default user with a simple hashed password
      defaultUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // password123
        }
      });
    }
    
    console.log(`Using user ${defaultUser.email} (${defaultUser.id}) as default`);
    
    // Update all categories without userId
    for (const category of categoriesWithoutUser) {
      await prisma.category.update({
        where: { id: category.id },
        data: { userId: defaultUser.id }
      });
      console.log(`Updated category: ${category.name}`);
    }
    
    console.log('All categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories();