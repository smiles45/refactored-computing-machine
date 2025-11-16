
import React from 'react';
import type { InventoryItem } from '../types';
import { PencilIcon } from './Icons';

interface InventoryListProps {
  inventory: InventoryItem[];
  onAdjustItem: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ inventory, onAdjustItem }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 font-semibold">Product Name</th>
            <th className="p-3 font-semibold">Size</th>
            <th className="p-3 font-semibold text-right">Quantity</th>
            <th className="p-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.size}</td>
              <td className={`p-3 text-right font-medium ${item.quantity < 20 ? 'text-red-500' : ''}`}>
                {item.quantity.toLocaleString()}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onAdjustItem(item)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full transition-colors"
                  aria-label={`Adjust ${item.name} ${item.size}`}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
