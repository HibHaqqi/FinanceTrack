import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TransactionForm from '@/components/transaction-form';
import { getWallets, getCategories } from '@/lib/data';

export default async function AddTransactionPage() {
  const wallets = await getWallets();
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
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
      </div>
    </div>
  );
}
