'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';

interface BalanceChartProps {
  transactions: Transaction[];
}

export default function BalanceChart({ transactions }: BalanceChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { name: string; income: number; expense: number, date: Date } } = {};

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} '${date.getFullYear().toString().slice(-2)}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { name: monthYear, income: 0, expense: 0, date: date };
      }

      if (tx.type === 'income') {
        monthlyData[monthYear].income += tx.amount;
      } else {
        monthlyData[monthYear].expense += tx.amount;
      }
    });

    return Object.values(monthlyData).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)
                }
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Legend />
              <Bar dataKey="income" stackId="a" fill="hsl(var(--chart-1))" name="Income" />
              <Bar dataKey="expense" stackId="a" fill="hsl(var(--chart-2))" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            No transaction data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
