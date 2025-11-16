import React from 'react';

const afyagoldLogo = "https://i.postimg.cc/T1L5Pn2v/Whats-App-Image-2025-11-06-at-5-54-03-AM.jpg"

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <img src={afyagoldLogo} alt="Afyagold Logo" className="h-12 w-12 rounded-full object-cover" />
        <h1 className="text-xl font-bold ml-4 text-gray-800 dark:text-white">
          Afyagold
        </h1>
      </div>
    </header>
  );
};

export default Header;
