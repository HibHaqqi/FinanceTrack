'use client';

import { useState, useMemo } from 'react';
import type { Transaction, Wallet, Category } from '@/lib/types';
import SummaryCard from './summary-card';
import CategoryChart from './category-chart';
import RecentTransactions from './recent-transactions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryIcon from './category-icon';

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
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() + 1 === parseInt(selectedMonth) && txDate.getFullYear() === parseInt(selectedYear);
    });
  }, [transactions, selectedMonth, selectedYear]);

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
    const allYears = transactions.map(tx => new Date(tx.date).getFullYear());
    return [...new Set(allYears)].sort((a,b) => b-a);
  },[transactions]);

  const months = [
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
        <div className="flex items-center gap-2">
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
        <SummaryCard title="Balance" value={balance} iconName="Wallet" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
           <CategoryChart transactions={filteredTransactions} categories={categories} />
        </div>
        <div className="lg:col-span-3">
            <RecentTransactions transactions={filteredTransactions} categories={categories} wallets={wallets} />
        </div>
      </div>
    </div>
  );
}
