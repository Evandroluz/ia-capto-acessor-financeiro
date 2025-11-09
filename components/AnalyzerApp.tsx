import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { FileUpload } from './FileUpload';
import { AnalysisDisplay } from './AnalysisDisplay';
import { Loader } from './Loader';
import { analyzeChart } from '../services/apiService';
import type { AnalysisResult, User } from '../types';
import { sampleAnalysis } from '../constants';

interface AnalyzerAppProps {
  user: User;
  onLogout: () => void;
  onGoToPricing: () => void;
}

export const AnalyzerApp: React.FC<AnalyzerAppProps> = ({ user, onLogout, onGoToPricing }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile || !imageUrl) {
      setError('Por favor, selecione uma imagem primeiro.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64Data = imageUrl.split(',')[1];
      const result = await analyzeChart({
          imageData: base64Data,
          mimeType: imageFile.type,
          userEmail: user.email, // Send user identifier for backend verification
      });
      if (result.error) {
          setError(result.error);
      } else {
          setAnalysis(result.analysis);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'Um erro inesperado ocorreu.';
      setError(`Falha ao analisar a imagem. ${errorMessage}. Por favor, tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imageUrl, user.email]);
  
  const handleUseSampleData = useCallback(() => {
    setImageUrl('https://picsum.photos/seed/finance/1024/768');
    setAnalysis(sampleAnalysis);
    setImageFile(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Header isLoggedIn={true} onLogout={onLogout} userEmail={user.email} />
      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col items-center">
        <div className="w-full bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          {user.subscription.status !== 'active' && (
            <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-bold">Assinatura Inativa</p>
                <p>Sua assinatura não está ativa. Por favor, renove para continuar analisando.</p>
              </div>
              <button
                onClick={onGoToPricing}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-colors flex-shrink-0"
              >
                Renovar Assinatura
              </button>
            </div>
          )}
          <FileUpload onFileSelect={handleFileSelect} imageUrl={imageUrl} onClear={handleClear} />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading || user.subscription.status !== 'active'}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {isLoading ? 'Analisando...' : 'Analisar Gráfico'}
            </button>
            <button
              onClick={handleUseSampleData}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Usar Dados de Exemplo
            </button>
          </div>

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Loader />
              <p className="text-lg text-indigo-300 mt-4 animate-pulse">
                A IA está analisando o gráfico... isso pode levar um momento.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-300">
              <p className="font-bold">Ocorreu um Erro</p>
              <p>{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-8">
              <AnalysisDisplay analysis={analysis} />
            </div>
          )}
        </div>
      </main>
      <footer className="w-full max-w-6xl mx-auto text-center py-6 text-gray-500 text-sm">
        <p>Desenvolvido com Gemini. Apenas para fins educacionais. Não é um conselho financeiro.</p>
      </footer>
    </div>
  );
};