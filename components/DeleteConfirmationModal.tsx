
import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';

interface DeleteConfirmationModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirmDelete: (itemId: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ item, onClose, onConfirmDelete }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset state when modal is opened for a new item or closed
    if (item) {
      setPassword('');
      setError('');
    }
  }, [item]);

  if (!item) return null;

  const handleDelete = () => {
    if (password === 'maxgold') {
      onConfirmDelete(item.id);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()} // Prevent closing modal on inner click
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Deletion</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold">{item.name} ({item.size})</span>? 
          This action cannot be undone.
        </p>

        <div className="mt-4">
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter password to confirm:
          </label>
          <input
            type="password"
            id="password-input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;