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
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const yearMatch = txDate.getFullYear() === parseInt(selectedYear);
      const monthMatch = selectedMonth === 'all' || txDate.getMonth() + 1 === parseInt(selectedMonth);
      return yearMatch && monthMatch;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const allTimeTransactions = useMemo(() => {
    return transactions.filter(tx => {
        const txDate = new Date(tx.date);
        const yearMatch = txDate.getFullYear() === parseInt(selectedYear);
        return yearMatch;
    })
  }, [transactions, selectedYear])

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

  const years = useMemo(() => {
    if (transactions.length === 0) {
      return [new Date().getFullYear()];
    }
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overall Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
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

      <Separator />

      <div className="grid gap-4">
        <RecentTransactions transactions={filteredTransactions} categories={categories} wallets={wallets} />
      </div>
    </div>
  );
}
