import DashboardClient from '@/components/dashboard-client';
import { getTransactions, getWallets, getCategories } from '@/lib/data';
import AppShell from '@/components/app-shell';

export default async function DashboardPage() {
  // In a real application, you would fetch this data based on the logged-in user.
  const transactions = await getTransactions();
  const wallets = await getWallets();
  const categories = await getCategories();

  return (
    <AppShell>
      <DashboardClient
        transactions={transactions}
        wallets={wallets}
        categories={categories}
      />
    </AppShell>
  );
}
