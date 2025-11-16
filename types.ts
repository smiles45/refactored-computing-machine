
export interface InventoryItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
}

export enum TransactionType {
  IN = 'Stock In',
  OUT = 'Stock Out',
  RETURN = 'Return',
  ADJUSTMENT = 'Stock Correction',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  itemName: string;
  itemSize: string;
  quantity: number;
  timestamp: Date;
}

export type Page = 'dashboard' | 'stock-in' | 'stock-out' | 'returns' | 'analytics' | 'install';
