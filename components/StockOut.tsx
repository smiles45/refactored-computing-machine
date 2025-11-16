import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface StockOutProps {
  batchStockOut: (items: { itemId: string, quantity: number }[]) => void;
  inventory: InventoryItem[];
}

const StockOut: React.FC<StockOutProps> = ({ batchStockOut, inventory }) => {
  const [quantities, setQuantities] = useState<Record<string, number | string>>({});
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleQuantityChange = (itemId: string, value: string, maxQuantity: number) => {
    setError('');
    const numValue = value === '' ? '' : parseInt(value, 10);

    if (numValue === '' || (numValue >= 0 && numValue <= maxQuantity)) {
      setQuantities(prev => ({ ...prev, [itemId]: numValue }));
    } else if (numValue > maxQuantity) {
      setQuantities(prev => ({ ...prev, [itemId]: maxQuantity }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFeedback('');

    const itemsToStockOut = Object.entries(quantities)
      .map(([itemId, quantity]) => ({
        itemId,
        quantity: typeof quantity === 'string' && quantity === '' ? 0 : Number(quantity),
      }))
      .filter(item => item.quantity > 0);

    if (itemsToStockOut.length === 0) {
      setError('Please enter a quantity for at least one item.');
      return;
    }

    // This check is already handled by the input's max property, but it's good practice.
    for (const item of itemsToStockOut) {
        const inventoryItem = inventory.find(i => i.id === item.itemId);
        if (inventoryItem && item.quantity > inventoryItem.quantity) {
            setError(`Cannot stock out more than available for ${inventoryItem.name} (${inventoryItem.size}).`);
            return;
        }
    }

    batchStockOut(itemsToStockOut);

    const totalItems = itemsToStockOut.reduce((sum, item) => sum + item.quantity, 0);
    setFeedback(`Successfully processed stock out for ${itemsToStockOut.length} product(s), totaling ${totalItems} units.`);
    setQuantities({});
    setTimeout(() => setFeedback(''), 4000);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Process Stock Out</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{currentDate}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {inventory.map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2">
                <p className="font-medium">{item.name} <span className="text-gray-500 dark:text-gray-400">({item.size})</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">On Hand: <span className="font-semibold">{item.quantity}</span></p>
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="0"
                  min="0"
                  max={item.quantity}
                  value={quantities[item.id] || ''}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value, item.quantity)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                  aria-label={`Quantity for ${item.name} ${item.size}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
            {error && <p className="text-center text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                Process Stock Out
            </button>
        </div>
      </form>
      {feedback && <p className="mt-4 text-center text-green-600 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-900/50 py-2 px-4 rounded-lg">{feedback}</p>}
    </div>
  );
};

export default StockOut;