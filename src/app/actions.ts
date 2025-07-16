'use server';

import { categorizeTransaction, CategorizeTransactionInput } from '@/ai/flows/categorize-transaction';

export async function getCategorySuggestion(input: CategorizeTransactionInput) {
  try {
    const result = await categorizeTransaction(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get category suggestion.' };
  }
}
