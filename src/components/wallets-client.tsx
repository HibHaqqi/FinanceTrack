'use client';

import { useState, useMemo } from 'react';
import type { Transaction, Wallet, Category } from '@/lib/types';
import SummaryCard from './summary-card';
import { Button } from './ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import WalletForm from './wallet-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteWallet } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface WalletsClientProps {
  wallets: Wallet[];
  transactions: Transaction[];
  categories: Category[];
}

export default function WalletsClient({ wallets, transactions }: WalletsClientProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const walletSummaries = useMemo(() => {
    return wallets.map((wallet) => {
      const walletTransactions = transactions.filter((tx) => tx.walletId === wallet.id);
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
        balance: income - expenses,
        income,
        expenses,
        transactionCount: walletTransactions.length,
      };
    });
  }, [wallets, transactions]);
  
  const handleDialogChange = (walletId: string, open: boolean) => {
    setDialogOpen((prev) => ({ ...prev, [walletId]: open }));
  };

  const handleFormSuccess = (walletId: string) => {
    handleDialogChange(walletId, false);
  };
  
  const handleDelete = async (id: string) => {
    const result = await deleteWallet(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Wallet deleted successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete wallet.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wallets</h1>
        <Dialog open={dialogOpen['new']} onOpenChange={(open) => handleDialogChange('new', open)}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
              <DialogDescription>Enter a name for your new wallet.</DialogDescription>
            </DialogHeader>
            <WalletForm onSuccess={() => handleFormSuccess('new')} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {walletSummaries.map((wallet) => (
          <div key={wallet.id} className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{wallet.name}</h2>
              <div className="flex items-center gap-2">
                 <Dialog open={dialogOpen[wallet.id]} onOpenChange={(open) => handleDialogChange(wallet.id, open)}>
                    <DialogTrigger asChild>
                       <Button variant="ghost" size="icon">
                         <Edit className="h-4 w-4" />
                       </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Wallet</DialogTitle>
                        <DialogDescription>Update the name of your wallet.</DialogDescription>
                      </DialogHeader>
                      <WalletForm wallet={wallet} onSuccess={() => handleFormSuccess(wallet.id)} />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" disabled={wallet.transactionCount > 0}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the wallet. You can only delete wallets with no transactions.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(wallet.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SummaryCard title="Income" value={wallet.income} iconName="TrendingUp" />
              <SummaryCard title="Expenses" value={wallet.expenses} iconName="TrendingDown" />
              <SummaryCard title="Balance" value={wallet.balance} iconName="Wallet" />
            </div>
          </div>
        ))}
      </div>
       {wallets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center">
            <h3 className="text-xl font-semibold">No Wallets Found</h3>
            <p className="text-muted-foreground mt-2">Get started by adding your first wallet.</p>
          </div>
        )}
    </div>
  );
}
