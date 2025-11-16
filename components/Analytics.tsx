
import React, { useState } from 'react';
import type { InventoryItem, Transaction } from '../types';
import { generateInventoryInsights } from '../services/geminiService';

interface AnalyticsProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ inventory, transactions }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const samplePrompts = [
    "Which items are running low and should be reordered?",
    "What was our highest moving product last week?",
    "Summarize the stock movements for 'Joto'.",
    "Are there any unusual patterns in the transaction log?",
  ];

  const handleGenerate = async (p: string = prompt) => {
    if (!p) {
        setError('Please enter a question or select a sample prompt.');
        return;
    }
    setError('');
    setIsLoading(true);
    setResponse('');
    
    try {
      const result = await generateInventoryInsights(inventory, transactions, p);
      setResponse(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">AI Inventory Analytics</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Ask questions about your inventory data and get instant insights from Gemini.</p>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="mb-4">
            <h3 className="font-semibold mb-2">Try these examples:</h3>
            <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p, i) => (
                    <button key={i} onClick={() => {setPrompt(p); handleGenerate(p);}} className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        {p}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Which item is selling fastest?"
            className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Thinking...' : 'Generate'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      {(isLoading || response) && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Insight</h2>
          {isLoading ? (
             <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p>Generating your report...</p>
            </div>
          ) : (
            <div className="prose prose-blue dark:prose-invert max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
