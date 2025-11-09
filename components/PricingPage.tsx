import React from 'react';
import { IconCheckCircle } from './Icons';

interface PricingPageProps {
  onSelectPlan: (plan: string) => void;
}

const PricingCard: React.FC<{
  planName: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  onSelect: () => void;
  isPopular?: boolean;
  paymentMethods: string;
}> = ({ planName, price, period, features, ctaText, onSelect, isPopular = false, paymentMethods }) => (
    <div className={`relative bg-gray-800/50 p-8 rounded-2xl border ${isPopular ? 'border-indigo-500' : 'border-gray-700'} flex flex-col`}>
        {isPopular && <div className="absolute top-0 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 text-sm font-bold rounded-full">MAIS POPULAR</div>}
        <h3 className="text-2xl font-bold text-white">{planName}</h3>
        <p className="mt-4">
            <span className="text-4xl font-extrabold text-white">{price}</span>
            <span className="text-gray-400">/{period}</span>
        </p>
        <p className="mt-2 text-sm text-gray-400">{paymentMethods}</p>
        <ul className="mt-8 space-y-4">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                    <IconCheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                </li>
            ))}
        </ul>
        <button 
            onClick={onSelect}
            className={`w-full mt-auto py-3 font-bold rounded-lg transition-transform transform hover:scale-105 ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
        >
            {ctaText}
        </button>
    </div>
);


export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const features = ["Análises ilimitadas", "Identificação de padrões", "Resumos por IA", "Suporte por e-mail"];
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Escolha o plano ideal para você</h2>
            <p className="mt-4 text-lg text-gray-400">Acesso completo à nossa IA de análise para turbinar suas operações.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl">
            <PricingCard
                planName="Semanal (PIX)"
                price="R$19,99"
                period="7 dias"
                features={features}
                ctaText="Pagar com PIX"
                onSelect={() => onSelectPlan('pix_semanal')}
                paymentMethods="Pagamento único via PIX"
            />
            <PricingCard
                planName="Mensal"
                price="R$69,99"
                period="mês"
                features={features}
                ctaText="Assinar Agora"
                onSelect={() => onSelectPlan('mensal')}
                isPopular={true}
                paymentMethods="Cartão de Crédito ou Débito"
            />
            <PricingCard
                planName="Anual"
                price="R$599,99"
                period="ano"
                features={[...features, "Economize R$239"]}
                ctaText="Assinar Agora"
                onSelect={() => onSelectPlan('anual')}
                paymentMethods="Cartão de Crédito ou Débito"
            />
        </div>
        <p className="mt-8 text-sm text-gray-500">Você pode cancelar a qualquer momento.</p>
    </div>
  );
};
