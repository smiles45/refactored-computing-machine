import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface StockInProps {
  stockIn: (name: string, size: string, quantity: number) => void;
  inventory: InventoryItem[];
}

const StockIn: React.FC<StockInProps> = ({ stockIn, inventory }) => {
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(inventory.length > 0 ? inventory[0].id : '');
  const [newProductName, setNewProductName] = useState('');
  const [newProductSize, setNewProductSize] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [feedback, setFeedback] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    let name = '';
    let size = '';

    if (isNewProduct) {
      if (!newProductName || !newProductSize) return;
      name = newProductName;
      size = newProductSize;
    } else {
      const selectedItem = inventory.find(item => item.id === selectedItemId);
      if (!selectedItem) return;
      name = selectedItem.name;
      size = selectedItem.size;
    }

    stockIn(name, size, quantity);
    setFeedback(`Successfully added ${quantity} units of ${name} (${size})!`);
    
    // Reset form
    setQuantity(10);
    setNewProductName('');
    setNewProductSize('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Stock</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{currentDate}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
                <label htmlFor="product-toggle" className="mr-4 font-medium">Add to Existing Product</label>
                <div 
                    onClick={() => setIsNewProduct(!isNewProduct)}
                    className="relative w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer transition-colors duration-300"
                >
                    <span 
                        className={`absolute left-1 h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isNewProduct ? 'translate-x-6' : ''}`}
                    ></span>
                </div>
                <label htmlFor="product-toggle" className="ml-4 font-medium">Add New Product</label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {isNewProduct ? (
                    <>
                        <div>
                            <label htmlFor="new-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Product Name</label>
                            <input type="text" id="new-name" value={newProductName} onChange={e => setNewProductName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="new-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Product Size</label>
                            <input type="text" id="new-size" value={newProductSize} onChange={e => setNewProductSize(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 1kg, 500ml"/>
                        </div>
                    </>
                ) : (
                    <div>
                        <label htmlFor="item" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                        <select id="item" value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            {inventory.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} - {item.size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} min="1" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Add to Inventory
                </button>
            </form>
            {feedback && <p className="mt-4 text-center text-green-600 dark:text-green-400">{feedback}</p>}
        </div>
    </div>
  );
};

export default StockIn;