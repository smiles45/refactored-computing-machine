
import React, { useState } from 'react';
import type { InventoryItem, Transaction } from '../types';
import { TransactionType } from '../types';
import Card from './Card';
import InventoryList from './InventoryList';
import { SearchIcon } from './Icons';
import AdjustStockModal from './AdjustStockModal';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  adjustStock: (itemId: string, quantity: number) => void;
}

const getTransactionColor = (type: TransactionType) => {
    switch(type) {
        case TransactionType.IN: return 'text-green-500';
        case TransactionType.OUT: return 'text-red-500';
        case TransactionType.RETURN: return 'text-blue-500';
        case TransactionType.ADJUSTMENT: return 'text-yellow-600 dark:text-yellow-500';
        default: return 'text-gray-500';
    }
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions, adjustStock }) => {
  const [inventorySearch, setInventorySearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [itemToAdjust, setItemToAdjust] = useState<InventoryItem | null>(null);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItemTypes = new Set(inventory.map(item => item.name)).size;
  const outOfStockItems = inventory.filter(item => item.quantity === 0).length;

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.size.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.itemName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
    t.itemSize.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  const handleConfirmAdjust = (itemId: string, quantity: number) => {
    adjustStock(itemId, quantity);
    setItemToAdjust(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Items in Stock" value={totalItems.toLocaleString()} />
            <Card title="Unique Product Types" value={uniqueItemTypes.toString()} />
            <Card title="Out of Stock Items" value={outOfStockItems.toString()} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                  type="text"
                  placeholder="Search by name or size..."
                  value={inventorySearch}
                  onChange={e => setInventorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <InventoryList inventory={filteredInventory} onAdjustItem={setItemToAdjust} />
            {inventory.length > 0 && filteredInventory.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No items match your search.</p>}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
             <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                  type="text"
                  placeholder="Search by name or size..."
                  value={transactionSearch}
                  onChange={e => setTransactionSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ul className="space-y-4">
              {filteredTransactions.slice(0, 7).map(t => (
                <li key={t.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">{t.itemName} ({t.itemSize})</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.timestamp.toLocaleTimeString()} - {t.type}</p>
                  </div>
                  <div className={`font-bold text-lg ${getTransactionColor(t.type)}`}>
                    {t.type === TransactionType.IN || t.type === TransactionType.RETURN ? '+' : '-'}{t.quantity}
                  </div>
                </li>
              ))}
              {transactions.length > 0 && filteredTransactions.length === 0 && <p className="text-gray-500 dark:text-gray-400">No transactions match your search.</p>}
              {transactions.length === 0 && <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>}
            </ul>
          </div>
        </div>
      </div>
      <AdjustStockModal
        item={itemToAdjust}
        onClose={() => setItemToAdjust(null)}
        onConfirmAdjust={handleConfirmAdjust}
      />
    </>
  );
};

export default Dashboard;
