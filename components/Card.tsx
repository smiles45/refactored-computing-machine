
import React from 'react';

interface CardProps {
  title: string;
  value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-gray-500 dark:text-gray-400 font-medium text-md">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
    </div>
  );
};

export default Card;
