import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateCategories() {
  console.log('Starting category migration for existing transactions...');

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
          icon: originalCategory.icon,
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
    }
  }

  console.log('Category migration completed successfully!');
}

migrateCategories()
  .catch((e) => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });