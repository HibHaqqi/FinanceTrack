import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
  // Create a default admin user if it doesn't exist
  const defaultUserEmail = 'admin@example.com';
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const defaultUser = await prisma.user.upsert({
    where: { email: defaultUserEmail },
    update: {},
    create: {
      email: defaultUserEmail,
      password: hashedPassword,
    },
  });

  console.log(`Default user created with ID: ${defaultUser.id}`);

  // Create default categories for the default user
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: category.name,
          userId: defaultUser.id
        }
      },
      update: {},
      create: {
        ...category,
        userId: defaultUser.id
      },
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