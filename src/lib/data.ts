import type { Transaction, Wallet, Category } from './types';

export const wallets: Wallet[] = [
  { id: 'wallet-1', name: 'Main Bank Account' },
  { id: 'wallet-2', name: 'Credit Card' },
  { id: 'wallet-3', name: 'Savings' },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Salary', icon: 'Briefcase' },
  { id: 'cat-2', name: 'Groceries', icon: 'Utensils' },
  { id: 'cat-3', name: 'Rent', icon: 'Home' },
  { id: 'cat-4', name: 'Transport', icon: 'Bus' },
  { id: 'cat-5', name: 'Clothing', icon: 'Shirt' },
  { id: 'cat-6', name: 'Health', icon: 'HeartPulse' },
  { id: 'cat-7', name: 'Gifts', icon: 'Gift' },
  { id: 'cat-8', name: 'Other', icon: 'Plus' },
];

const today = new Date();

export const transactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'income',
    description: 'Monthly Salary',
    amount: 5000,
    date: new Date(today.getFullYear(), today.getMonth(), 1),
    categoryId: 'cat-1',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-2',
    type: 'expense',
    description: 'Weekly Groceries',
    amount: 150.75,
    date: new Date(today.getFullYear(), today.getMonth(), 2),
    categoryId: 'cat-2',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-3',
    type: 'expense',
    description: 'Apartment Rent',
    amount: 1200,
    date: new Date(today.getFullYear(), today.getMonth(), 3),
    categoryId: 'cat-3',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-4',
    type: 'expense',
    description: 'Bus Fare',
    amount: 25.5,
    date: new Date(today.getFullYear(), today.getMonth(), 5),
    categoryId: 'cat-4',
    walletId: 'wallet-2',
  },
    {
    id: 'txn-5',
    type: 'expense',
    description: 'New T-shirt',
    amount: 45.99,
    date: new Date(today.getFullYear(), today.getMonth(), 7),
    categoryId: 'cat-5',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-6',
    type: 'expense',
    description: 'Pharmacy',
    amount: 30.20,
    date: new Date(today.getFullYear(), today.getMonth(), 10),
    categoryId: 'cat-6',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-7',
    type: 'expense',
    description: 'Birthday gift for friend',
    amount: 50,
    date: new Date(today.getFullYear(), today.getMonth(), 12),
    categoryId: 'cat-7',
    walletId: 'wallet-1',
  },
  // Previous month's transaction for testing filter
  {
    id: 'txn-8',
    type: 'income',
    description: 'Freelance Project',
    amount: 750,
    date: new Date(today.getFullYear(), today.getMonth() - 1, 15),
    categoryId: 'cat-1',
    walletId: 'wallet-3',
  },
  {
    id: 'txn-9',
    type: 'expense',
    description: 'Coffee Shop',
    amount: 5.50,
    date: new Date(today.getFullYear(), today.getMonth(), 15),
    categoryId: 'cat-8',
    walletId: 'wallet-2',
  },
];


// Mock API functions
export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(transactions), 500));
};

export const getWallets = async (): Promise<Wallet[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(wallets), 500));
};

export const getCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(categories), 500));
};
