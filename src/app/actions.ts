'use server';

import { categorizeTransaction, CategorizeTransactionInput } from '@/ai/flows/categorize-transaction';
import { addTransaction as dbAddTransaction, updateTransaction as dbUpdateTransaction, deleteTransaction as dbDeleteTransaction } from '@/lib/data';
import type { Transaction } from '@/lib/types';
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
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete transaction.' };
    }
}