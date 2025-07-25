'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
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
import CategoryForm from './category-form';
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
import { deleteCategory, getCategories } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import CategoryIcon from './category-icon';

interface CategoriesClientProps {
  categories: Category[];
  userId: string;
}

export default function CategoriesClient({ categories, userId }: CategoriesClientProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState<Record<string, boolean>>({});

  const handleDialogChange = (categoryId: string, open: boolean) => {
    setDialogOpen((prev) => ({ ...prev, [categoryId]: open }));
  };

  const handleFormSuccess = (categoryId: string) => {
    handleDialogChange(categoryId, false);
  };
  
  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Category deleted successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete category.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categories</h1>
        <Dialog open={dialogOpen['new']} onOpenChange={(open) => handleDialogChange('new', open)}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Enter a name and icon for your new category.</DialogDescription>
            </DialogHeader>
            <CategoryForm onSuccess={() => handleFormSuccess('new')} userId={userId} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CategoryIcon icon={category.icon} />
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={dialogOpen[category.id]} onOpenChange={(open) => handleDialogChange(category.id, open)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogDescription>Update the name and icon of your category.</DialogDescription>
                    </DialogHeader>
                    <CategoryForm category={category} onSuccess={() => handleFormSuccess(category.id)} userId={userId} />
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the category.
                        You cannot delete categories that are used in transactions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center">
          <h3 className="text-xl font-semibold">No Categories Found</h3>
          <p className="text-muted-foreground mt-2">Get started by adding your first category.</p>
        </div>
      )}
    </div>
  );
}