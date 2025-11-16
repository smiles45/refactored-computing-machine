import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAUpdatePrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (offlineReady) {
      console.log('App ready to work offline');
    }
  }, [offlineReady]);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-start">
        <div className="flex-1">
          {offlineReady ? (
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">App ready to work offline</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                The app can now work without an internet connection.
              </p>
            </div>
          ) : needRefresh ? (
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">New version available</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                A new version of the app is available. Click reload to update.
              </p>
            </div>
          ) : null}
        </div>
        <button
          onClick={close}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {needRefresh && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Reload
          </button>
          <button
            onClick={close}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
};

export default PWAUpdatePrompt;

