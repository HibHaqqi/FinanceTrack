// use server'
'use server';

/**
 * @fileOverview AI-powered transaction categorization flow.
 *
 * This file defines a Genkit flow for automatically categorizing
 * financial transactions based on their description.
 *
 * @remarks
 * This flow utilizes a pre-trained model fine-tuned for financial
 * transactions to provide intelligent categorization.
 *
 * @exports categorizeTransaction - The main function to categorize a transaction.
 * @exports CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * @exports CategorizeTransactionOutput - The output type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  description: z.string().describe('The description of the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z.string().describe('The predicted category of the transaction.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const transactionCategorizationPrompt = ai.definePrompt({
  name: 'transactionCategorizationPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are a financial expert specializing in categorizing transactions.

  Based on the transaction description provided, determine the most appropriate category.
  Also, provide a confidence level (0-1) for your prediction.

  Description: {{{description}}}
  `,
});

const categorizeTransactionFlow = ai.defineFlow({
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await transactionCategorizationPrompt(input);
    return output!;
  }
);
