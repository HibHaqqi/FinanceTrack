import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Housing', icon: '🏠' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Health', icon: '❤️' },
  { name: 'Education', icon: '📚' },
  { name: 'Salary', icon: '💰' },
  { name: 'Other', icon: '🤷' },
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });