import prisma from './prisma';
import type { Transaction, Wallet, Category } from './types';

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const transactions = await prisma.transaction.findMany({
    where: { wallet: { userId } },
    include: { category: true },
  });
  return transactions;
};

export const getWallets = async (userId: string): Promise<Wallet[]> => {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
  });
  return wallets;
};

export const getCategories = async (userId?: string): Promise<Category[]> => {
  if (userId) {
    // If userId is provided, filter categories by userId
    const categories = await prisma.category.findMany({
      where: { userId },
    });
    return categories;
  } else {
    // For backward compatibility, return all categories if userId is not provided
    const categories = await prisma.category.findMany();
    return categories;
  }
};

export const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  const newCategory = await prisma.category.create({
    data: category,
  });
  return newCategory;
};

export const updateCategory = async (updatedCategory: Omit<Category, 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
  const category = await prisma.category.update({
    where: { id: updatedCategory.id },
    data: updatedCategory,
  });
  return category;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  // Check if category is used in any transactions
  const transactionsWithCategory = await prisma.transaction.findFirst({
    where: { categoryId: id },
  });

  if (transactionsWithCategory) {
    throw new Error('Cannot delete category that is used in transactions');
  }

  await prisma.category.delete({ where: { id } });
  return true;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'category' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  // Handle transfer transactions
  if (transaction.type === 'transfer' && transaction.destinationWalletId) {
    // For transfers, we'll create two transactions:
    // 1. An expense in the source wallet
    const sourceTransaction = await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        description: `Transfer to another wallet: ${transaction.description}`,
        type: 'expense', // Use expense for the source wallet
        date: transaction.date,
        walletId: transaction.walletId,
        categoryId: transaction.categoryId,
      },
      include: { category: true },
    });
    
    // 2. An income in the destination wallet
    await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        description: `Transfer from another wallet: ${transaction.description}`,
        type: 'income', // Use income for the destination wallet
        date: transaction.date,
        walletId: transaction.destinationWalletId,
        categoryId: transaction.categoryId,
      },
      include: { category: true },
    });
    
    // Return the source transaction
    return sourceTransaction as Transaction;
  }
  
  // Handle regular transactions (income/expense)
  const newTransaction = await prisma.transaction.create({
    data: {
      ...transaction,
      type: transaction.type,
    },
    include: { category: true },
  });
  return newTransaction as Transaction;
};

export const updateTransaction = async (updatedTransaction: Omit<Transaction, 'category' | 'createdAt' | 'updatedAt'>): Promise<Transaction | null> => {
  const transaction = await prisma.transaction.update({
    where: { id: updatedTransaction.id },
    data: {
      ...updatedTransaction,
      type: updatedTransaction.type === 'transfer' ? 'expense' : updatedTransaction.type, // Convert transfer to expense for DB
    },
    include: { category: true },
  });
  return transaction as Transaction | null;
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  await prisma.transaction.delete({ where: { id } });
  return true;
};

export const addWallet = async (wallet: Omit<Wallet, 'id' | 'userId'> & { userId: string }): Promise<Wallet> => {
  const newWallet = await prisma.wallet.create({
    data: wallet,
  });
  return newWallet;
};

export const updateWallet = async (updatedWallet: Wallet): Promise<Wallet | null> => {
  const wallet = await prisma.wallet.update({
    where: { id: updatedWallet.id },
    data: updatedWallet,
  });
  return wallet;
};

export const deleteWallet = async (id: string): Promise<boolean> => {
  await prisma.transaction.deleteMany({ where: { walletId: id } });
  await prisma.wallet.delete({ where: { id } });
  return true;
};