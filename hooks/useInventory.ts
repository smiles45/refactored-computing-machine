
import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem, Transaction } from '../types';
import { TransactionType } from '../types';
import { supabase } from '../services/supabaseClient';

const initialInventory: InventoryItem[] = [
  // Joto
  { id: 'joto-1kg', name: 'Joto', size: '1kg', quantity: 100 },
  { id: 'joto-2kg', name: 'Joto', size: '2kg', quantity: 80 },

  // Stocklick
  { id: 'stocklick-1kg', name: 'Stocklick', size: '1kg', quantity: 50 },
  { id: 'stocklick-2kg', name: 'Stocklick', size: '2kg', quantity: 50 },
  { id: 'stocklick-5kg', name: 'Stocklick', size: '5kg', quantity: 50 },
  { id: 'stocklick-10kg', name: 'Stocklick', size: '10kg', quantity: 50 },
  { id: 'stocklick-20kg', name: 'Stocklick', size: '20kg', quantity: 30 },
  { id: 'stocklick-50kg', name: 'Stocklick', size: '50kg', quantity: 20 },

  // Maziwa
  { id: 'maziwa-1kg', name: 'Maziwa', size: '1kg', quantity: 150 },
  { id: 'maziwa-2kg', name: 'Maziwa', size: '2kg', quantity: 120 },
  { id: 'maziwa-5kg', name: 'Maziwa', size: '5kg', quantity: 100 },
  { id: 'maziwa-10kg', name: 'Maziwa', size: '10kg', quantity: 60 },
  { id: 'maziwa-20kg', name: 'Maziwa', size: '20kg', quantity: 40 },
  
  // Magadi
  { id: 'magadi-2kg', name: 'Magadi', size: '2kg', quantity: 150 },
];

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load inventory
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory')
          .select('*')
          .order('name', { ascending: true });

        if (inventoryError) {
          console.error('Error loading inventory:', inventoryError);
          // If table doesn't exist, use initial inventory
          if (inventoryData && inventoryData.length > 0) {
            setInventory(inventoryData as InventoryItem[]);
          }
        } else if (inventoryData && inventoryData.length > 0) {
          setInventory(inventoryData as InventoryItem[]);
        } else {
          // If database is empty, seed with initial data
          await seedInitialInventory();
        }

        // Load transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1000);

        if (transactionsError) {
          console.error('Error loading transactions:', transactionsError);
        } else if (transactionsData) {
          // Map snake_case to camelCase and convert timestamp
          const transactionsWithDates = transactionsData.map(t => ({
            id: t.id,
            type: t.type as TransactionType,
            itemName: t.item_name,
            itemSize: t.item_size,
            quantity: t.quantity,
            timestamp: new Date(t.timestamp)
          })) as Transaction[];
          setTransactions(transactionsWithDates);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // Seed initial inventory if database is empty
  const seedInitialInventory = async () => {
    try {
      const { error } = await supabase
        .from('inventory')
        .insert(initialInventory);

      if (error) {
        console.error('Error seeding inventory:', error);
      } else {
        setInventory(initialInventory);
      }
    } catch (error) {
      console.error('Error seeding inventory:', error);
    }
  };

  // Save inventory to Supabase
  const saveInventory = useCallback(async (newInventory: InventoryItem[]) => {
    if (!isInitialized) return;
    
    try {
      // Upsert all inventory items
      const { error } = await supabase
        .from('inventory')
        .upsert(newInventory, { onConflict: 'id' });

      if (error) {
        console.error('Error saving inventory:', error);
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  }, [isInitialized]);

  // Save transaction to Supabase
  const saveTransaction = useCallback(async (transaction: Transaction) => {
    if (!isInitialized) return;
    
    try {
      // Convert camelCase to snake_case and Date to ISO string for Supabase
      const transactionForDb = {
        id: transaction.id,
        type: transaction.type,
        item_name: transaction.itemName,
        item_size: transaction.itemSize,
        quantity: transaction.quantity,
        timestamp: transaction.timestamp.toISOString()
      };

      const { error } = await supabase
        .from('transactions')
        .insert(transactionForDb);

      if (error) {
        console.error('Error saving transaction:', error);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, [isInitialized]);

  const addTransaction = useCallback(async (type: TransactionType, name: string, size: string, quantity: number) => {
    const newTransaction: Transaction = {
      id: `${new Date().toISOString()}-${name}-${size}`,
      type,
      itemName: name,
      itemSize: size,
      quantity,
      timestamp: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    await saveTransaction(newTransaction);
  }, [saveTransaction]);

  const stockIn = useCallback(async (name: string, size: string, quantity: number) => {
    setInventory(prevInventory => {
      const itemId = `${name.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase().replace(/\s+/g, '-')}`;
      const existingItem = prevInventory.find(item => item.id === itemId);
      
      let updatedInventory: InventoryItem[];
      if (existingItem) {
        updatedInventory = prevInventory.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedInventory = [...prevInventory, { id: itemId, name, size, quantity }];
      }
      
      // Save to Supabase
      saveInventory(updatedInventory);
      return updatedInventory;
    });
    await addTransaction(TransactionType.IN, name, size, quantity);
  }, [addTransaction, saveInventory]);

  const batchStockOut = useCallback(async (itemsToStockOut: { itemId: string, quantity: number }[]) => {
    const stockOutMap = new Map(itemsToStockOut.map(i => [i.itemId, i.quantity]));

    setInventory(prevInventory => {
      const updatedInventory = prevInventory.map(item => {
        if (stockOutMap.has(item.id)) {
          const quantityToOut = stockOutMap.get(item.id)!;
          return { ...item, quantity: Math.max(0, item.quantity - quantityToOut) };
        }
        return item;
      });
      
      // Save to Supabase
      saveInventory(updatedInventory);
      return updatedInventory;
    });
    
    // Find original items to get name and size for transactions
    for (const itemToStockOut of itemsToStockOut) {
      const originalItem = inventory.find(i => i.id === itemToStockOut.itemId);
      if (originalItem) {
        await addTransaction(TransactionType.OUT, originalItem.name, originalItem.size, itemToStockOut.quantity);
      }
    }
  }, [inventory, addTransaction, saveInventory]);

  const processReturn = useCallback(async (name: string, size: string, quantity: number) => {
    // A return is essentially a stock-in
    await stockIn(name, size, quantity);
    
    // Overwrite the last transaction type to be 'Return'
    setTransactions(prev => {
      const latestTransactions = [...prev];
      if (latestTransactions.length > 0) {
        // Find the most recent transaction for this item
        const transactionIndex = latestTransactions.findIndex(
          t => t.itemName === name && t.itemSize === size && t.type === TransactionType.IN
        );
        if (transactionIndex > -1) {
          const updatedTransaction = {
            ...latestTransactions[transactionIndex],
            type: TransactionType.RETURN
          };
          latestTransactions[transactionIndex] = updatedTransaction;
          
          // Update in Supabase
          supabase
            .from('transactions')
            .update({ type: TransactionType.RETURN })
            .eq('id', updatedTransaction.id)
            .then(({ error }) => {
              if (error) console.error('Error updating transaction:', error);
            });
        }
      }
      return latestTransactions;
    });
  }, [stockIn]);

  const adjustStock = useCallback(async (itemId: string, quantityToRemove: number) => {
    let itemName = '';
    let itemSize = '';

    setInventory(prevInventory => {
      const updatedInventory = prevInventory.map(item => {
        if (item.id === itemId) {
          itemName = item.name;
          itemSize = item.size;
          return { ...item, quantity: Math.max(0, item.quantity - quantityToRemove) };
        }
        return item;
      });
      
      // Save to Supabase
      saveInventory(updatedInventory);
      return updatedInventory;
    });

    if (itemName && itemSize && quantityToRemove > 0) {
      await addTransaction(TransactionType.ADJUSTMENT, itemName, itemSize, quantityToRemove);
    }
  }, [addTransaction, saveInventory]);

  return { inventory, transactions, stockIn, batchStockOut, processReturn, adjustStock, isLoading };
};
