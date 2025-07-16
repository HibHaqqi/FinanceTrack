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
  { id: 'cat-9', name: 'Entertainment', icon: 'Film' },
  { id: 'cat-10', name: 'Utilities', icon: 'Lightbulb' },

];

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

export const transactions: Transaction[] = [
  // Current Month
  {
    id: 'txn-1',
    type: 'income',
    description: 'Monthly Salary',
    amount: 5000,
    date: new Date(currentYear, currentMonth, 1),
    categoryId: 'cat-1',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-2',
    type: 'expense',
    description: 'Weekly Groceries',
    amount: 150.75,
    date: new Date(currentYear, currentMonth, 2),
    categoryId: 'cat-2',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-3',
    type: 'expense',
    description: 'Apartment Rent',
    amount: 1200,
    date: new Date(currentYear, currentMonth, 3),
    categoryId: 'cat-3',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-4',
    type: 'expense',
    description: 'Bus Fare',
    amount: 25.5,
    date: new Date(currentYear, currentMonth, 5),
    categoryId: 'cat-4',
    walletId: 'wallet-2',
  },
    {
    id: 'txn-5',
    type: 'expense',
    description: 'New T-shirt',
    amount: 45.99,
    date: new Date(currentYear, currentMonth, 7),
    categoryId: 'cat-5',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-6',
    type: 'expense',
    description: 'Pharmacy',
    amount: 30.20,
    date: new Date(currentYear, currentMonth, 10),
    categoryId: 'cat-6',
    walletId: 'wallet-2',
  },
  {
    id: 'txn-7',
    type: 'expense',
    description: 'Birthday gift for friend',
    amount: 50,
    date: new Date(currentYear, currentMonth, 12),
    categoryId: 'cat-7',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-9',
    type: 'expense',
    description: 'Coffee Shop',
    amount: 5.50,
    date: new Date(currentYear, currentMonth, 15),
    categoryId: 'cat-8',
    walletId: 'wallet-2',
  },

  // Previous Month
  {
    id: 'txn-8',
    type: 'income',
    description: 'Freelance Project',
    amount: 750,
    date: new Date(currentYear, currentMonth - 1, 15),
    categoryId: 'cat-1',
    walletId: 'wallet-3',
  },
  {
    id: 'txn-10',
    type: 'income',
    description: 'Monthly Salary',
    amount: 5000,
    date: new Date(currentYear, currentMonth - 1, 1),
    categoryId: 'cat-1',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-11',
    type: 'expense',
    description: 'Apartment Rent',
    amount: 1200,
    date: new Date(currentYear, currentMonth - 1, 3),
    categoryId: 'cat-3',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-12',
    type: 'expense',
    description: 'Movie Night',
    amount: 42.5,
    date: new Date(currentYear, currentMonth - 1, 18),
    categoryId: 'cat-9',
    walletId: 'wallet-2',
  },

  // Two Months Ago
  {
    id: 'txn-13',
    type: 'income',
    description: 'Monthly Salary',
    amount: 5000,
    date: new Date(currentYear, currentMonth - 2, 1),
    categoryId: 'cat-1',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-14',
    type: 'expense',
    description: 'Apartment Rent',
    amount: 1200,
    date: new Date(currentYear, currentMonth - 2, 3),
    categoryId: 'cat-3',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-15',
    type: 'expense',
    description: 'Electricity Bill',
    amount: 75.6,
    date: new Date(currentYear, currentMonth - 2, 20),
    categoryId: 'cat-10',
    walletId: 'wallet-1',
  },
    // Three Months Ago
  {
    id: 'txn-16',
    type: 'income',
    description: 'Monthly Salary',
    amount: 4800, // slightly different salary
    date: new Date(currentYear, currentMonth - 3, 1),
    categoryId: 'cat-1',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-17',
    type: 'expense',
    description: 'Apartment Rent',
    amount: 1200,
    date: new Date(currentYear, currentMonth - 3, 3),
    categoryId: 'cat-3',
    walletId: 'wallet-1',
  },
  {
    id: 'txn-18',
    type: 'income',
    description: 'Sold old laptop',
    amount: 400,
    date: new Date(currentYear, currentMonth - 3, 10),
    categoryId: 'cat-8',
    walletId: 'wallet-3',
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
