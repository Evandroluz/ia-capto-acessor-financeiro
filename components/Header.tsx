import React from 'react';
import { IconChart, IconGemini, IconUser } from './Icons';

interface HeaderProps {
    isLoggedIn?: boolean;
    onLogout?: () => void;
    userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout, userEmail }) => {
  return (
    <header className="w-full max-w-6xl mx-auto py-6 md:py-10 relative flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <IconChart className="w-10 h-10 text-indigo-400" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            IA Capto Acessor Financeiro
          </h1>
        </div>
        <p className="mt-4 text-lg text-gray-400 flex items-center justify-center gap-2">
          Desenvolvido com <IconGemini className="w-6 h-6" /> Gemini
        </p>
      </div>

      {isLoggedIn && onLogout && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-white text-sm">{userEmail}</p>
          </div>
          <IconUser className="w-8 h-8 text-gray-400" />
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
};