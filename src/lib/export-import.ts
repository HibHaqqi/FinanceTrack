import * as XLSX from 'xlsx';
import { Transaction, Category, Wallet } from './types';
import prisma from './prisma';
import { addTransaction } from '@/app/actions';

// Function to export transactions to Excel
export async function exportTransactionsToExcel(
  userId: string,
  walletId?: string,
  month?: string,
  year?: string
): Promise<Buffer> {
  // Fetch transactions with filters
  const whereClause: any = { wallet: { userId } };
  
  if (walletId && walletId !== 'all') {
    whereClause.walletId = walletId;
  }
  
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    
    if (month && month !== 'all') {
      const monthNum = parseInt(month);
      const lastDay = new Date(parseInt(year), monthNum, 0).getDate();
      whereClause.date = {
        gte: new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`),
        lte: new Date(`${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`)
      };
    } else {
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    }
  }

  // Fetch transactions with related data
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    include: {
      category: true,
      wallet: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Transform data for Excel
  const worksheetData = transactions.map(tx => ({
    ID: tx.id,
    Date: tx.date.toISOString().split('T')[0],
    Type: tx.type,
    Amount: tx.amount,
    Description: tx.description,
    Category: tx.category.name,
    Wallet: tx.wallet.name,
    DestinationWalletId: tx.destinationWalletId || '',
    CreatedAt: tx.createdAt.toISOString(),
    UpdatedAt: tx.updatedAt.toISOString(),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return excelBuffer;
}

// Function to parse CSV data and import transactions
export async function importTransactionsFromCSV(
  fileBuffer: Buffer,
  userId: string
): Promise<{ success: boolean; imported: number; errors: string[] }> {
  try {
    // Parse CSV data
    const workbook = XLSX.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Get user's wallets and categories for validation
    const userWallets = await prisma.wallet.findMany({
      where: { userId },
    });
    
    const userCategories = await prisma.category.findMany({
      where: { userId },
    });
    
    const walletMap = new Map(userWallets.map(w => [w.name, w.id]));
    const categoryMap = new Map(userCategories.map(c => [c.name, c.id]));
    
    // Process each row
    const errors: string[] = [];
    let importedCount = 0;
    
    for (let i = 0; i < jsonData.length; i++) {
      const row: any = jsonData[i];
      
      try {
        // Validate required fields
        if (!row.Type || !row.Amount || !row.Description || !row.Category || !row.Wallet || !row.Date) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }
        
        // Validate and get wallet ID
        const walletId = walletMap.get(row.Wallet);
        if (!walletId) {
          errors.push(`Row ${i + 1}: Wallet "${row.Wallet}" not found`);
          continue;
        }
        
        // Validate and get category ID
        const categoryId = categoryMap.get(row.Category);
        if (!categoryId) {
          errors.push(`Row ${i + 1}: Category "${row.Category}" not found`);
          continue;
        }
        
        // Validate transaction type
        const type = row.Type.toLowerCase();
        if (!['income', 'expense', 'transfer'].includes(type)) {
          errors.push(`Row ${i + 1}: Invalid transaction type "${row.Type}"`);
          continue;
        }
        
        // Validate amount
        const amount = parseFloat(row.Amount);
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${i + 1}: Invalid amount "${row.Amount}"`);
          continue;
        }
        
        // Validate date
        const date = new Date(row.Date);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date "${row.Date}"`);
          continue;
        }
        
        // For transfer transactions, validate destination wallet
        let destinationWalletId = undefined;
        if (type === 'transfer') {
          if (!row.DestinationWallet) {
            errors.push(`Row ${i + 1}: Missing destination wallet for transfer`);
            continue;
          }
          
          destinationWalletId = walletMap.get(row.DestinationWallet);
          if (!destinationWalletId) {
            errors.push(`Row ${i + 1}: Destination wallet "${row.DestinationWallet}" not found`);
            continue;
          }
          
          if (destinationWalletId === walletId) {
            errors.push(`Row ${i + 1}: Source and destination wallets cannot be the same`);
            continue;
          }
        }
        
        // Create transaction
        await prisma.transaction.create({
          data: {
            amount,
            description: row.Description,
            type: type as 'income' | 'expense' | 'transfer',
            date,
            walletId,
            categoryId,
            destinationWalletId,
          },
        });
        
        importedCount++;
      } catch (error) {
        errors.push(`Row ${i + 1}: ${(error as Error).message}`);
      }
    }
    
    return {
      success: importedCount > 0,
      imported: importedCount,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      errors: [(error as Error).message],
    };
  }
}