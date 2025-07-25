'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { addCategory, updateCategory } from '@/app/actions';
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
  name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
  icon: z.string().min(1, { message: 'Icon is required.' }),
});

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  userId: string;
}

export default function CategoryForm({ category, onSuccess, userId }: CategoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const isEditMode = !!category;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startSubmittingTransition(async () => {
      const result = isEditMode
        ? await updateCategory({ id: category.id, name: values.name, icon: values.icon, userId })
        : await addCategory({ name: values.name, icon: values.icon, userId });

      if (result.success) {
        toast({
          title: isEditMode ? 'Category Updated!' : 'Category Added!',
          description: `The category "${values.name}" has been saved.`,
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Food" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (Emoji)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 🍔" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            isEditMode ? 'Update Category' : 'Add Category'
          )}
        </Button>
      </form>
    </Form>
  );
}