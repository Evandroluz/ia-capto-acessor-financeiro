import React, { useState, useCallback, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { AnalyzerApp } from './components/AnalyzerApp';
import { AuthPage } from './components/AuthPage';
import type { User } from './types';
import { checkServerStatus } from './services/apiService';

type AppState = 'landing' | 'pricing' | 'auth' | 'loggedIn';

const ServerStatusBanner: React.FC = () => (
    <div className="bg-red-900 text-red-200 p-3 text-center text-sm fixed top-0 left-0 right-0 z-50 shadow-lg">
        <strong>Atenção:</strong> Não foi possível conectar ao servidor backend. As funcionalidades de registro, login e análise não funcionarão.
        Para mais detalhes, consulte o arquivo <strong>README.md</strong>.
    </div>
);

const PaymentSuccessMessage: React.FC<{ onAcknowledge: () => void }> = ({ onAcknowledge }) => (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center max-w-lg">
            <h2 className="text-2xl font-bold text-green-400">Pagamento Concluído com Sucesso!</h2>
            <p className="text-gray-300 mt-4">
                Sua assinatura está ativa. Por favor, faça login com o email que você utilizou para acessar a plataforma.
            </p>
            <button
                onClick={onAcknowledge}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Fazer Login
            </button>
        </div>
    </div>
);

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('landing');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isServerOnline, setIsServerOnline] = useState(true); // Assume online to avoid flicker

    useEffect(() => {
        // Check server status on initial load to provide immediate feedback
        const verifyServerStatus = async () => {
            const result = await checkServerStatus();
            if (result.status !== 'ok') {
                setIsServerOnline(false);
            }
        };
        verifyServerStatus();

        const urlParams = new URLSearchParams(window.location.search);
        // Verifica se a URL contém um parâmetro de sucesso de pagamento do Stripe
        if (urlParams.get('payment') === 'success') {
            setShowSuccessMessage(true);
            // Limpa a URL para não mostrar a mensagem novamente ao recarregar
            window.history.replaceState(null, '', window.location.pathname);
        }

        // Verifica o caminho da URL para definir o estado inicial (ex: para o cancel_url do Stripe)
        if (window.location.pathname.includes('/pricing')) {
            setAppState('pricing');
        }
    }, []);

    const handleGetStarted = useCallback(() => setAppState('pricing'), []);

    const handleSelectPlan = useCallback((plan: string) => {
        setSelectedPlan(plan);
        setAppState('auth');
    }, []);

    const handleAuthenticationSuccess = useCallback((user: User) => {
        setCurrentUser(user);
        setAppState('loggedIn');
    }, []);
    
    const handleReturnToPricing = useCallback(() => {
        setAppState('pricing');
        setSelectedPlan(null);
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setSelectedPlan(null);
        setAppState('landing');
    }, []);

    const handleGoToPricing = useCallback(() => setAppState('pricing'), []);

    const handleAcknowledgeSuccess = () => {
        setShowSuccessMessage(false);
        setAppState('auth'); // Leva o usuário para a página de login/autenticação
    };
    
    if (showSuccessMessage) {
        return <PaymentSuccessMessage onAcknowledge={handleAcknowledgeSuccess} />;
    }

    const renderContent = () => {
        switch (appState) {
            case 'pricing':
                return <PricingPage onSelectPlan={handleSelectPlan} />;
            case 'auth':
                if (!selectedPlan) {
                    // Se o usuário chegar na autenticação sem um plano, volta para os preços
                    return <PricingPage onSelectPlan={handleSelectPlan} />;
                }
                return <AuthPage 
                            plan={selectedPlan} 
                            onAuthSuccess={handleAuthenticationSuccess} 
                            onBack={handleReturnToPricing} 
                        />;
            case 'loggedIn':
                return <AnalyzerApp user={currentUser!} onLogout={handleLogout} onGoToPricing={handleGoToPricing} />;
            case 'landing':
            default:
                return <LandingPage onGetStarted={handleGetStarted} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {!isServerOnline && <ServerStatusBanner />}
            <div className={!isServerOnline ? 'pt-12' : ''}>
              {renderContent()}
            </div>
        </div>
    );
};

export default App;