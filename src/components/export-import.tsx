'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ExportImportProps {
  walletId?: string;
  month?: string;
  year?: string;
}

export default function ExportImport({ walletId, month, year }: ExportImportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    errors: string[];
  } | null>(null);

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (walletId && walletId !== 'all') params.append('walletId', walletId);
      if (month && month !== 'all') params.append('month', month);
      if (year) params.append('year', year);
      
      // Make request to export API
      const response = await fetch(`/api/export?${params.toString()}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to export transactions');
      }
      
      // Get file blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Export Successful',
        description: 'Your transactions have been exported to Excel.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your transactions.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType !== 'csv' && fileType !== 'xlsx') {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a CSV or Excel file.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Handle import confirmation
  const handleImportConfirm = async () => {
    if (!selectedFile) return;
    
    try {
      setIsImporting(true);
      
      // Create form data with file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Make request to import API
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setImportResult({
          success: true,
          imported: result.imported,
          errors: result.errors || [],
        });
        
        toast({
          title: 'Import Successful',
          description: `Successfully imported ${result.imported} transactions.`,
        });
      } else {
        setImportResult({
          success: false,
          imported: 0,
          errors: result.errors || ['Unknown error occurred'],
        });
        
        toast({
          title: 'Import Failed',
          description: 'There was an error importing your transactions.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        imported: 0,
        errors: [(error as Error).message],
      });
      
      toast({
        title: 'Import Failed',
        description: 'There was an error importing your transactions.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      setConfirmDialogOpen(false);
      setImportDialogOpen(false);
    }
  };

  // Handle import button click
  const handleImportClick = () => {
    if (selectedFile) {
      setConfirmDialogOpen(true);
    } else {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to import.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Export to Excel
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import from CSV
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import transactions. The file should have the following columns:
              Type, Amount, Description, Category, Wallet, Date, and DestinationWallet (for transfers).
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleImportClick} disabled={!selectedFile || isImporting}>
              {isImporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                'Import'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Import</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to import transactions from {selectedFile?.name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              {isImporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                'Import'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {importResult && (
        <Dialog open={!!importResult} onOpenChange={() => setImportResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {importResult.success ? 'Import Successful' : 'Import Failed'}
              </DialogTitle>
              <DialogDescription>
                {importResult.success
                  ? `Successfully imported ${importResult.imported} transactions.`
                  : 'Failed to import transactions.'}
              </DialogDescription>
            </DialogHeader>
            
            {importResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium">Errors:</h4>
                <ul className="list-disc pl-5 mt-2 max-h-60 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setImportResult(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}