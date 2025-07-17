'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Wallet } from '@/lib/types';
import { addWallet, updateWallet } from '@/app/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Wallet name must be at least 2 characters.' }),
});

interface WalletFormProps {
  wallet?: Wallet;
  onSuccess?: () => void;
  userId: string;
}

export default function WalletForm({ wallet, onSuccess, userId }: WalletFormProps) {
  const { toast } = useToast();
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const isEditMode = !!wallet;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: wallet?.name || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startSubmittingTransition(async () => {
      const result = isEditMode
        ? await updateWallet({ ...wallet, name: values.name })
        : await addWallet({ name: values.name, userId });

      if (result.success) {
        toast({
          title: isEditMode ? 'Wallet Updated!' : 'Wallet Added!',
          description: `The wallet "${values.name}" has been saved.`,
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Checking Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            isEditMode ? 'Update Wallet' : 'Add Wallet'
          )}
        </Button>
      </form>
    </Form>
  );
}
