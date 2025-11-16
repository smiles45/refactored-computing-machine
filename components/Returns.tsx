import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface ReturnsProps {
  processReturn: (name: string, size: string, quantity: number) => void;
  inventory: InventoryItem[];
}

const Returns: React.FC<ReturnsProps> = ({ processReturn, inventory }) => {
  const [selectedItemId, setSelectedItemId] = useState(inventory.length > 0 ? inventory[0].id : '');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const selectedItem = inventory.find(item => item.id === selectedItemId);
    
    if (!selectedItem) {
        setError('Please select a valid item.');
        return;
    }

    if (quantity <= 0) {
        setError('Quantity must be greater than zero.');
        return;
    }

    processReturn(selectedItem.name, selectedItem.size, quantity);
    setFeedback(`Successfully processed return of ${quantity} units of ${selectedItem.name} (${selectedItem.size})!`);
    setQuantity(1);
    setTimeout(() => setFeedback(''), 3000);
  };
  
  return (
    <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Process Return</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{currentDate}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="item" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                    <select id="item" value={selectedItemId} onChange={e => { setSelectedItemId(e.target.value); setError(''); }} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {inventory.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name} - {item.size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => {setQuantity(parseInt(e.target.value, 10)); setError('');}} min="1" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Add Returned Stock
                </button>
            </form>
            {feedback && <p className="mt-4 text-center text-green-600 dark:text-green-400">{feedback}</p>}
        </div>
    </div>
  );
};

export default Returns;