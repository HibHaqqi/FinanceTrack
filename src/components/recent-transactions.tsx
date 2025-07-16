'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction, Category, Wallet } from '@/lib/types';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
}

export default function RecentTransactions({
  transactions,
  categories,
  wallets,
}: RecentTransactionsProps) {
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || 'N/A';
  
  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {tx.type === 'income' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryName(tx.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(tx.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
