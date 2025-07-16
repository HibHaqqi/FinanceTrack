'use client';

import { useState, useMemo } from 'react';
import type { Transaction, Wallet, Category } from '@/lib/types';
import SummaryCard from './summary-card';
import CategoryChart from './category-chart';
import BalanceChart from './balance-chart';
import RecentTransactions from './recent-transactions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface DashboardClientProps {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
}

export default function DashboardClient({
  transactions,
  wallets,
  categories,
}: DashboardClientProps) {
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const yearMatch = txDate.getFullYear() === parseInt(selectedYear);
      const monthMatch = selectedMonth === 'all' || txDate.getMonth() + 1 === parseInt(selectedMonth);
      const walletMatch = selectedWallet === 'all' || tx.walletId === selectedWallet;
      return yearMatch && monthMatch && walletMatch;
    });
  }, [transactions, selectedMonth, selectedYear, selectedWallet]);

  const allTimeTransactions = useMemo(() => {
    return transactions.filter(tx => {
        const txDate = new Date(tx.date);
        const yearMatch = txDate.getFullYear() === parseInt(selectedYear);
        const walletMatch = selectedWallet === 'all' || tx.walletId === selectedWallet;
        return yearMatch && walletMatch;
    })
  }, [transactions, selectedYear, selectedWallet])

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    for (const tx of filteredTransactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
      }
    }
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }, [filteredTransactions]);

  const walletSummaries = useMemo(() => {
    const activeWallets = selectedWallet === 'all' ? wallets : wallets.filter(w => w.id === selectedWallet);
    return activeWallets.map(wallet => {
      const walletTransactions = transactions.filter(tx => tx.walletId === wallet.id && new Date(tx.date).getFullYear() === parseInt(selectedYear));
      let income = 0;
      let expenses = 0;
      for (const tx of walletTransactions) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expenses += tx.amount;
        }
      }
      return {
        ...wallet,
        income,
        expenses,
        balance: income - expenses,
      };
    });
  }, [wallets, transactions, selectedYear, selectedWallet]);

  const years = useMemo(() => {
    const allYears = transactions.map(tx => new Date(tx.date).getFullYear());
    return [...new Set(allYears)].sort((a,b) => b-a);
  },[transactions]);

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
           <Select value={selectedWallet} onValueChange={setSelectedWallet}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wallets</SelectItem>
              {wallets.map(wallet => (
                <SelectItem key={wallet.id} value={wallet.id}>{wallet.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard title="Total Income" value={totalIncome} iconName="TrendingUp" />
        <SummaryCard title="Total Expenses" value={totalExpenses} iconName="TrendingDown" />
        <SummaryCard title="Overall Balance" value={balance} iconName="Wallet" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <BalanceChart transactions={allTimeTransactions} />
          <CategoryChart transactions={filteredTransactions} categories={categories} />
      </div>

       {selectedWallet === 'all' && (
        <>
          <Separator />
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Wallets</h2>
            <div className="space-y-8">
                {walletSummaries.map(wallet => (
                    <div key={wallet.id} className="space-y-4">
                        <h3 className="text-lg font-semibold">{wallet.name}</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <SummaryCard title="Income" value={wallet.income} iconName="TrendingUp" />
                            <SummaryCard title="Expenses" value={wallet.expenses} iconName="TrendingDown" />
                            <SummaryCard title="Balance" value={wallet.balance} iconName="Wallet" />
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="grid gap-4">
        <RecentTransactions transactions={filteredTransactions} categories={categories} wallets={wallets} />
      </div>
    </div>
  );
}
