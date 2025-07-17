import Header from '@/components/header';
import WalletsClient from '@/components/wallets-client';
import { getWallets, getTransactions, getCategories } from '@/lib/data';

export default async function WalletsPage() {
  const wallets = await getWallets();
  const transactions = await getTransactions();
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <WalletsClient wallets={wallets} transactions={transactions} categories={categories} />
      </main>
    </div>
  );
}
