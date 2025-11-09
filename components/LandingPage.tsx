import React from 'react';
import { IconChart, IconGemini, IconCheckCircle } from './Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const Feature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <IconCheckCircle className="w-6 h-6 text-indigo-400 flex-shrink-0" />
        <span className="text-gray-300">{children}</span>
    </li>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
        <div className="max-w-3xl">
            <header className="w-full mx-auto text-center py-6 md:py-10">
                <div className="flex items-center justify-center gap-4">
                    <IconChart className="w-10 h-10 md:w-12 md:h-12 text-indigo-400" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    IA Capto Acessor Financeiro
                    </h1>
                </div>
                <p className="mt-4 text-lg text-gray-400 flex items-center justify-center gap-2">
                    Desenvolvido com <IconGemini className="w-6 h-6" /> Gemini
                </p>
            </header>

            <main className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Desvende o Mercado com Inteligência Artificial</h2>
                <p className="mt-4 text-lg md:text-xl text-gray-400">
                    Transforme gráficos financeiros complexos em insights claros e acionáveis. Nossa IA identifica padrões, analisa tendências e fornece recomendações para suas próximas operações.
                </p>
                <ul className="mt-8 space-y-4 text-left inline-block">
                    <Feature>Análise de padrões de candlestick em segundos.</Feature>
                    <Feature>Resumos técnicos gerados por IA.</Feature>
                    <Feature>Recomendações de Compra, Venda ou Aguardar.</Feature>
                    <Feature>Função de áudio para ouvir a análise.</Feature>
                </ul>
            </main>

            <footer className="mt-12">
                <button
                    onClick={onGetStarted}
                    className="px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Começar Agora
                </button>
                <p className="mt-4 text-sm text-gray-500">Crie sua conta e inicie sua análise em menos de um minuto.</p>
            </footer>
        </div>
    </div>
  );
};