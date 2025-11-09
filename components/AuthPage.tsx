import React, { useState } from 'react';
import { login, register, createCheckoutSession } from '../services/apiService';
import { Loader } from './Loader';
import type { User } from '../types';

interface AuthPageProps {
  plan: string;
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ plan, onAuthSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoginView, setIsLoginView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationAndCheckout = async () => {
    // 1. Tenta registrar o usuário. Se o usuário já existir, o backend retornará um erro específico.
    // O fluxo continua para permitir que usuários existentes comprem um novo plano.
    const registerResponse = await register(email);

    // 2. Se o erro retornado NÃO for sobre um e-mail já existente, então é um erro real que devemos mostrar.
    if (registerResponse.error && !registerResponse.error.includes('já está cadastrado')) {
        throw new Error(registerResponse.error);
    }
    
    // 3. Cria a sessão de checkout no Stripe.
    const checkoutResponse = await createCheckoutSession(plan, email);
    if (checkoutResponse.url) {
        // 4. Redireciona o usuário para a página de pagamento do Stripe.
        window.location.href = checkoutResponse.url;
    } else {
        throw new Error(checkoutResponse.error || 'Não foi possível iniciar o pagamento. Verifique se o servidor backend está rodando corretamente.');
    }
  }

  const handleLogin = async () => {
    const response = await login(email);
    if (response.user) {
        onAuthSuccess(response.user);
    } else {
        throw new Error(response.error || 'Ocorreu um erro desconhecido.');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLoginView) {
        await handleLogin();
        // Em caso de sucesso, o componente será desmontado, então não precisamos resetar o loading.
      } else {
        await handleRegistrationAndCheckout();
        // O usuário será redirecionado, então não precisamos resetar o loading aqui.
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar com o servidor. Tente novamente mais tarde.');
      // Apenas resetamos o loading em caso de erro, para que o usuário possa tentar novamente.
      setIsLoading(false);
    }
  };

  const planNameMap: { [key: string]: string } = {
    'pix_semanal': 'Semanal (PIX)',
    'mensal': 'Mensal',
    'anual': 'Anual'
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-indigo-400 hover:underline mb-4">
            &larr; Voltar para planos
        </button>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center">
            {isLoginView ? 'Acessar sua Conta' : 'Criar sua Conta'}
          </h2>
          {!isLoginView && (
            <p className="text-center text-gray-400 mt-2">
                Plano selecionado: <span className="font-bold text-indigo-400">{planNameMap[plan]}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500"
              >
                {isLoading ? <Loader size="sm" /> : (isLoginView ? 'Entrar' : 'Continuar para Pagamento')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-indigo-400 hover:text-indigo-300 ml-1">
              {isLoginView ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
            Pagamentos seguros processados por Stripe.
        </p>
      </div>
    </div>
  );
};