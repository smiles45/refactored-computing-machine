
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StockIn from './components/StockIn';
import StockOut from './components/StockOut';
import Returns from './components/Returns';
import Analytics from './components/Analytics';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useInventory } from './hooks/useInventory';
import type { Page } from './types';
import { CubeIcon, ArrowUpIcon, ArrowDownIcon, ArrowUturnLeftIcon, ChartBarIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const inventoryHook = useInventory();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard inventory={inventoryHook.inventory} transactions={inventoryHook.transactions} adjustStock={inventoryHook.adjustStock} />;
      case 'stock-in':
        return <StockIn stockIn={inventoryHook.stockIn} inventory={inventoryHook.inventory} />;
      case 'stock-out':
        return <StockOut batchStockOut={inventoryHook.batchStockOut} inventory={inventoryHook.inventory} />;
      case 'returns':
        return <Returns processReturn={inventoryHook.processReturn} inventory={inventoryHook.inventory} />;
      case 'analytics':
        return <Analytics inventory={inventoryHook.inventory} transactions={inventoryHook.transactions} />;
      default:
        return <Dashboard inventory={inventoryHook.inventory} transactions={inventoryHook.transactions} adjustStock={inventoryHook.adjustStock}/>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <CubeIcon /> },
    { id: 'stock-in', label: 'Stock In', icon: <ArrowUpIcon /> },
    { id: 'stock-out', label: 'Stock Out', icon: <ArrowDownIcon /> },
    { id: 'returns', label: 'Returns', icon: <ArrowUturnLeftIcon /> },
    { id: 'analytics', label: 'AI Analytics', icon: <ChartBarIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <Header />
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 p-4 md:min-h-[calc(100vh-64px)]">
          <nav>
            <ul>
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={`w-full flex items-center p-3 my-2 rounded-lg transition-colors duration-200 text-left ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {inventoryHook.isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading inventory data...</p>
              </div>
            </div>
          ) : (
            renderPage()
          )}
        </main>
      </div>
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
    </div>
  );
};

export default App;