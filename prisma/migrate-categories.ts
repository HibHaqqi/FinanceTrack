import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateCategories() {
  console.log('Starting category migration for existing transactions...');

  try {
    // First, ensure all categories have a userId
    const categoriesWithoutUser = await prisma.category.findMany({
      where: {
        userId: null
      }
    });

    if (categoriesWithoutUser.length > 0) {
      console.log(`Found ${categoriesWithoutUser.length} categories without a user ID`);
      
      // Get or create a default user
      let defaultUser = await prisma.user.findFirst();
      
      if (!defaultUser) {
        console.log('No users found, creating a default admin user');
        defaultUser = await prisma.user.create({
          data: {
            email: 'admin@example.com',
            password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // password123
          }
        });
        console.log(`Created default user with ID: ${defaultUser.id}`);
      } else {
        console.log(`Using existing user as default: ${defaultUser.email}`);
      }
      
      // Update categories to use the default user
      for (const category of categoriesWithoutUser) {
        try {
          await prisma.category.update({
            where: { id: category.id },
            data: { userId: defaultUser.id }
          });
          console.log(`Updated category ${category.name} to use default user`);
        } catch (error) {
          console.error(`Error updating category ${category.name}:`, error);
        }
      }
    } else {
      console.log('All categories already have a userId assigned');
    }

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`Processing user: ${user.email}`);

      // Get all transactions for this user through their wallets
      const transactions = await prisma.transaction.findMany({
        where: {
          wallet: {
            userId: user.id
          }
        },
        include: {
          category: true
        }
      });

      console.log(`Found ${transactions.length} transactions for user ${user.email}`);

      // Group transactions by category
      const categoriesMap = new Map();
      for (const transaction of transactions) {
        const categoryName = transaction.category.name;
        if (!categoriesMap.has(categoryName)) {
          categoriesMap.set(categoryName, {
            originalCategory: transaction.category,
            transactions: []
          });
        }
        categoriesMap.get(categoryName).transactions.push(transaction);
      }

      // Process each category
      for (const [categoryName, data] of categoriesMap.entries()) {
        const { originalCategory, transactions } = data;
        
        console.log(`Processing category: ${categoryName} with ${transactions.length} transactions`);

        try {
          // Check if this category already belongs to the user
          if (originalCategory.userId === user.id) {
            console.log(`Category ${categoryName} already belongs to user ${user.email}`);
            continue;
          }

          // Create or find user-specific category
          const userCategory = await prisma.category.upsert({
            where: {
              name_userId: {
                name: categoryName,
                userId: user.id
              }
            },
            update: {},
            create: {
              name: categoryName,
              icon: originalCategory.icon || '📁', // Default icon if none exists
              userId: user.id
            }
          });

          console.log(`Using user-specific category: ${userCategory.id}`);

          // Update all transactions to use the user-specific category
          for (const transaction of transactions) {
            await prisma.transaction.update({
              where: { id: transaction.id },
              data: { categoryId: userCategory.id }
            });
          }

          console.log(`Updated ${transactions.length} transactions for category ${categoryName}`);
        } catch (error) {
          console.error(`Error processing category ${categoryName}:`, error);
        }
      }
    }

    console.log('Category migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrateCategories()
  .catch((e) => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });