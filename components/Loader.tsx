import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-gray-600 border-t-indigo-400 ${sizeClasses[size]}`}
      role="status"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};