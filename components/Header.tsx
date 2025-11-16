import React from 'react';

const afyagoldLogo = "https://i.postimg.cc/T1L5Pn2v/Whats-App-Image-2025-11-06-at-5-54-03-AM.jpg"

const Header: React.FC = () => {
  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/install';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <img src={afyagoldLogo} alt="Afyagold Logo" className="h-12 w-12 rounded-full object-cover" />
        <h1 className="text-xl font-bold ml-4 text-gray-800 dark:text-white">
          Afyagold
        </h1>
      </div>
      <a
        href="/install"
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Install App
      </a>
    </header>
  );
};

export default Header;
