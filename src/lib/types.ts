
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  walletId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Wallet {
  id: string;
  name: string;
}
