import prisma from './prisma';
import type { Transaction, Wallet, Category } from './types';

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const transactions = await prisma.transaction.findMany({
    where: { wallet: { userId } },
    include: { category: true },
  });
  return transactions.map(t => ({...t, type: t.type as 'income' | 'expense'}));
};

export const getWallets = async (userId: string): Promise<Wallet[]> => {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
  });
  return wallets;
};

export const getCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'category'>): Promise<Transaction> => {
  const newTransaction = await prisma.transaction.create({
    data: {
      ...transaction,
      type: transaction.type,
    },
    include: { category: true },
  });
  return {...newTransaction, type: newTransaction.type as 'income' | 'expense'};
};

export const updateTransaction = async (updatedTransaction: Omit<Transaction, 'category'>): Promise<Transaction | null> => {
  const transaction = await prisma.transaction.update({
    where: { id: updatedTransaction.id },
    data: {
      ...updatedTransaction,
      type: updatedTransaction.type,
    },
    include: { category: true },
  });
  return transaction ? {...transaction, type: transaction.type as 'income' | 'expense'} : null;
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