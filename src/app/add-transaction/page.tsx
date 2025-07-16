import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TransactionForm from '@/components/transaction-form';
import { getWallets, getCategories } from '@/lib/data';
import AppShell from '@/components/app-shell';

export default async function AddTransactionPage() {
  const wallets = await getWallets();
  const categories = await getCategories();

  return (
    <AppShell>
        <Card>
          <CardHeader>
            <CardTitle>Add a New Transaction</CardTitle>
            <CardDescription>
              Fill out the form below to add a new expense or income.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm wallets={wallets} categories={categories} />
          </CardContent>
        </Card>
    </AppShell>
  );
}
