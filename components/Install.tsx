import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as standalone (already installed)
    if ((window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsSupported(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if browser supports PWA installation
    if (!('serviceWorker' in navigator)) {
      setIsSupported(false);
      setError('Service Workers are not supported in this browser.');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setError('Install prompt is not available. Please use your browser\'s install option.');
      return;
    }

    setIsInstalling(true);
    setError(null);

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      } else {
        setError('Installation was cancelled.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during installation.');
    } finally {
      setIsInstalling(false);
    }
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') || userAgent.includes('edge')) {
      return {
        title: 'Chrome/Edge Instructions',
        steps: [
          'Look for the install icon (➕) in the address bar',
          'Click the install icon',
          'Click "Install" in the popup'
        ]
      };
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return {
        title: 'Safari Instructions (iOS)',
        steps: [
          'Tap the Share button (square with arrow)',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        title: 'Firefox Instructions',
        steps: [
          'Click the menu button (☰)',
          'Click "Install" or look for the install icon in the address bar'
        ]
      };
    }
    
    return {
      title: 'General Instructions',
      steps: [
        'Look for an install option in your browser menu',
        'Follow your browser\'s installation prompts'
      ]
    };
  };

  const instructions = getBrowserInstructions();

  if (isInstalled) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">App Installed!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              StockFlow is already installed on your device.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Install StockFlow</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Install StockFlow as a Progressive Web App for a better experience with offline support and faster access.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {deferredPrompt ? (
          <div className="mb-6">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Installing...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Install StockFlow
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm mb-4">
              The install button is not available. Please use your browser's install option:
            </p>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{instructions.title}</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Benefits of Installing</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-800 dark:text-white">Offline Access:</strong> Use the app even without an internet connection</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-800 dark:text-white">Faster Loading:</strong> App-like performance with cached resources</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-800 dark:text-white">Home Screen Access:</strong> Launch directly from your device's home screen</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong className="text-gray-800 dark:text-white">Auto-Updates:</strong> Get the latest features automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Install;

