'use server';

import { categorizeTransaction, CategorizeTransactionInput } from '@/ai/flows/categorize-transaction';
import { 
  addTransaction as dbAddTransaction, 
  updateTransaction as dbUpdateTransaction, 
  deleteTransaction as dbDeleteTransaction,
  addWallet as dbAddWallet,
  updateWallet as dbUpdateWallet,
  deleteWallet as dbDeleteWallet
} from '@/lib/data';
import type { Transaction, Wallet } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getCategorySuggestion(input: CategorizeTransactionInput) {
  try {
    const result = await categorizeTransaction(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get category suggestion.' };
  }
}


export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
    try {
        await dbAddTransaction(transaction);
        revalidatePath('/');
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add transaction.' };
    }
}

export async function updateTransaction(transaction: Transaction) {
    try {
        await dbUpdateTransaction(transaction);
        revalidatePath('/');
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update transaction.' };
    }
}

export async function deleteTransaction(id: string) {
    try {
        await dbDeleteTransaction(id);
        revalidatePath('/');
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete transaction.' };
    }
}

export async function addWallet(wallet: Omit<Wallet, 'id'>) {
    try {
        await dbAddWallet(wallet);
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add wallet.' };
    }
}

export async function updateWallet(wallet: Wallet) {
    try {
        await dbUpdateWallet(wallet);
        revalidatePath('/wallets');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update wallet.' };
    }
}

export async function deleteWallet(id: string) {
    try {
        await dbDeleteWallet(id);
        revalidatePath('/wallets');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete wallet.' };
    }
}
