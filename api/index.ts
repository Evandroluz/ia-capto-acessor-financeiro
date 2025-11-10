// api/index.ts
// Este é o servidor backend. Em produção, ele é executado como uma "Serverless Function".

// ===================================================================================
// =================== GUIA DE IMPLANTAÇÃO E CONFIGURAÇÃO ============================
// ===================================================================================
//
// Para instruções detalhadas sobre como implantar este aplicativo em um servidor
// de hospedagem (como a Vercel), consulte o arquivo `README.md` na raiz do projeto.
//
// O `README.md` contém o passo a passo completo, incluindo:
// 1. Como colocar seu código em um repositório Git (GitHub).
// 2. Como fazer o deploy na Vercel.
// 3. Como configurar as Variáveis de Ambiente obrigatórias.
// 4. Como configurar o webhook do Stripe para produção.
//
// ===================================================================================


// FIX: Changed express import to default import to resolve type conflicts.
import express from 'express';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import Stripe from 'stripe';
import cors from 'cors';

// --- CONFIGURAÇÃO E INICIALIZAÇÃO ---

const app: express.Express = express();
const port = 3001; // Porta para o servidor backend

// --- LEITURA DAS VARIÁVEIS DE AMBIENTE ---
// Em produção, estas variáveis DEVEM ser configuradas no seu provedor de hospedagem.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const GEMINI_API_KEY = process.env.API_KEY!;
const WEBAPP_URL = process.env.WEBAPP_URL!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Verificações de segurança para garantir que as chaves foram configuradas
if (!STRIPE_SECRET_KEY || !GEMINI_API_KEY || !STRIPE_WEBHOOK_SECRET || !WEBAPP_URL) {
    console.error("ERRO CRÍTICO: Pelo menos uma das variáveis de ambiente obrigatórias (API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, WEBAPP_URL) não foi configurada. Consulte o README.md.");
    // Em um ambiente real, você poderia impedir o servidor de iniciar.
    // process.exit(1); 
}


// IDs de Preço - Estes podem ser os mesmos para teste e produção,
// mas certifique-se de que eles existem em ambos os modos no seu painel Stripe.
const PRICE_IDS = {
    pix_semanal: 'price_1SRJF3FkcJq2kyKuDYM9RY0g',
    mensal: 'price_1SRJJZFkcJq2kyKuy5H4luf3',
    anual: 'price_1SRJKgFkcJq2kyKupMYiqHVp',
};
// ===================================================================================

// FIX: Updated Stripe API version to a recent, valid version to fix type error.
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- BANCO DE DADOS EM MEMÓRIA (SIMULADO) ---
const users: any = {}; // Simples objeto para armazenar usuários por email

// --- MIDDLEWARE ---
app.use(cors());
// FIX: Type issue with express middleware, resolved by changing express import style.
app.use('/api/stripe-webhook', express.raw({type: 'application/json'}));
// FIX: Type issue with express middleware, resolved by changing express import style.
app.use(express.json({ limit: '10mb' }));

// --- ROTAS DA API ---

// Rota de Status (Health Check) para o frontend verificar se o servidor está online
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.get('/api/status', (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed res object now has .status() method.
    res.status(200).json({ status: 'ok', message: 'Servidor está online.' });
});

// Rota de Registro
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/register', async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Correctly typed req object now has .body property.
        const { email } = req.body;
        if (!email) {
            // FIX: Correctly typed res object now has .status() method.
            return res.status(400).json({ error: 'Email é obrigatório.' });
        }
        if (users[email]) {
            // FIX: Correctly typed res object now has .status() method.
            return res.status(400).json({ error: 'Este email já está cadastrado. Por favor, faça login.' });
        }

        const customer = await stripe.customers.create({ email });

        users[email] = {
            id: Object.keys(users).length + 1,
            email,
            stripeCustomerId: customer.id,
            subscription: {
                plan: 'none',
                status: 'inactive',
                expiresAt: null,
            }
        };

        console.log(`Cliente Stripe criado e usuário registrado: ${email}`);
        // FIX: Correctly typed res object now has .status() method.
        res.status(201).json({ user: users[email] });
    } catch (error: any) {
        console.error('Erro na rota /api/register:', error);
        // FIX: Correctly typed res object now has .status() method.
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao registrar.' });
    }
});

// Rota de Login
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/login', (req: express.Request, res: express.Response) => {
    try {
        // FIX: Correctly typed req object now has .body property.
        const { email } = req.body;
        if (!users[email]) {
            // FIX: Correctly typed res object now has .status() method.
            return res.status(404).json({ error: 'Usuário não encontrado. Por favor, cadastre-se.' });
        }
        if (users[email].subscription.expiresAt && new Date(users[email].subscription.expiresAt) < new Date()) {
            users[email].subscription.status = 'inactive';
        }

        console.log(`Usuário logado: ${email}`);
        // FIX: Correctly typed res object now has .json() method.
        res.json({ user: users[email] });
    } catch (error) {
        console.error('Erro GERAL na rota /api/login:', error);
        // FIX: Correctly typed res object now has .status() method.
        res.status(500).json({ error: 'Ocorreu um erro interno inesperado no servidor.' });
    }
});

// Rota para criar a Sessão de Checkout do Stripe
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/create-checkout-session', async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed req object now has .body property.
    const { plan, userEmail } = req.body;

    if (!users[userEmail] || !users[userEmail].stripeCustomerId) {
        // FIX: Correctly typed res object now has .status() method.
        return res.status(400).json({ error: 'Usuário não encontrado ou não possui ID de cliente Stripe.' });
    }

    const priceId = (PRICE_IDS as any)[plan];
    if (!priceId) {
        // FIX: Correctly typed res object now has .status() method.
        return res.status(400).json({ error: 'Plano inválido selecionado.' });
    }

    try {
        let session;
        const successUrl = `${WEBAPP_URL}?payment=success`;
        const cancelUrl = `${WEBAPP_URL}/pricing`; 
        
        if (plan === 'pix_semanal') {
            session = await stripe.checkout.sessions.create({
                customer: users[userEmail].stripeCustomerId,
                payment_method_types: ['pix'],
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    plan: 'pix_semanal',
                    userEmail: userEmail
                }
            });
        } else {
            session = await stripe.checkout.sessions.create({
                customer: users[userEmail].stripeCustomerId,
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
        }

        // FIX: Correctly typed res object now has .json() method.
        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Erro ao criar sessão de checkout do Stripe:', error);
        // FIX: Correctly typed res object now has .status() method.
        res.status(500).json({ error: error.message });
    }
});

// Rota de Webhook do Stripe
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/stripe-webhook', (req: express.Request, res: express.Response) => {
    if (!STRIPE_WEBHOOK_SECRET) {
        console.error('⚠️  Webhook Error: Segredo do webhook não configurado no servidor.');
        // FIX: Correctly typed res object now has .status() method.
        return res.status(500).send('Webhook Error: Segredo do webhook não configurado.');
    }
    // FIX: Correctly typed req object now has .headers property.
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    if (!sig) {
        console.error('⚠️  Webhook Error: Cabeçalho stripe-signature ausente.');
        // FIX: Correctly typed res object now has .status() method.
        return res.status(400).send('Webhook Error: Cabeçalho stripe-signature ausente.');
    }

    try {
        // FIX: Correctly typed req object now has .body property.
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`⚠️  Falha na verificação da assinatura do webhook:`, err.message);
        // FIX: Correctly typed res object now has .status() method.
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const findUserByStripeId = (stripeId: string) => Object.values(users).find((user: any) => user.stripeCustomerId === stripeId);
    
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Checkout session completed:', session.id);
            
            if (session.mode === 'payment' && session.metadata?.plan === 'pix_semanal') {
                const userEmail = session.metadata.userEmail;
                const user = users[userEmail];
                if (user) {
                    const expiresAt = new Date();
                    expiresAt.setDate(expiresAt.getDate() + 7);
                    user.subscription.status = 'active';
                    user.subscription.expiresAt = expiresAt.toISOString();
                    console.log(`Acesso de 7 dias (PIX) ativado para ${user.email}. Expira em: ${user.subscription.expiresAt}`);
                }
            } else if (session.mode === 'subscription' && session.customer && session.subscription) {
                stripe.subscriptions.retrieve(session.subscription.toString()).then(subscription => {
                    const user: any = findUserByStripeId(subscription.customer.toString());
                    if (user) {
                        user.subscription.status = 'active';
                        // FIX: Cast to 'any' to bypass faulty Stripe type definition for current_period_end.
                        user.subscription.expiresAt = new Date((subscription as any).current_period_end * 1000).toISOString();
                        console.log(`Assinatura de cartão ativada para ${user.email}. Expira em: ${user.subscription.expiresAt}`);
                    }
                });
            }
            break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`Subscription event: ${event.type}`, subscription.id);
            if (subscription.customer) {
                const user: any = findUserByStripeId(subscription.customer.toString());
                if (user) {
                    user.subscription.status = subscription.status === 'active' ? 'active' : 'inactive';
                    // FIX: Cast to 'any' to bypass faulty Stripe type definition for current_period_end.
                    user.subscription.expiresAt = (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null;
                    console.log(`Assinatura atualizada para ${user.email}. Novo status: ${user.subscription.status}`);
                }
            }
            break;

        default:
            console.log(`Evento não tratado: ${event.type}`);
    }

    // FIX: Correctly typed res object now has .json() method.
    res.json({ received: true });
});

// Rota de Análise de Gráfico
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/analyze', async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Correctly typed req object now has .body property.
        const { imageData, mimeType, userEmail } = req.body;

        if (!users[userEmail] || users[userEmail].subscription.status !== 'active') {
            // FIX: Correctly typed res object now has .status() method.
            return res.status(403).json({ error: 'Acesso negado. Assinatura inativa ou usuário não encontrado.' });
        }

        const model = 'gemini-2.5-pro';
        const imagePart = { inlineData: { data: imageData, mimeType } };
        
        const systemInstruction = `Você é 'IA Capto', um especialista em análise técnica de gráficos financeiros para day trade, focado em mini-índice e mini-dólar na B3, operando em timeframes de 5 minutos (M5) ou 15 minutos (M15). Sua análise deve ser direta, objetiva e formatada estritamente em JSON.

        Sua tarefa é analisar a imagem de um gráfico de candlestick e fornecer as seguintes informações:
        1.  'asset': Identifique o ativo e, se possível, o pregão. Se não for claro, use "Ativo não identificado".
        2.  'timeframe': Identifique o timeframe do gráfico. Se não for claro, use "Timeframe não identificado".
        3.  'patterns': Liste os padrões de candlestick e de análise técnica mais relevantes (suporte, resistência, LTA, LTB, OCO, OCOI, etc.) que justificam sua decisão. Agrupe os padrões por categoria (ex: "Candlesticks", "Estrutura", "Indicadores"). Formato: ["Categoria: Pão 1", "Categoria: Pão 2"].
        4.  'summary': Um resumo conciso da análise técnica, explicando o contexto atual do mercado (tendência, consolidação) e a lógica por trás da recomendação.
        5.  'entryTime': O ponto de entrada crucial. Forneça o horário EXATO da entrada principal e, se aplicável, até duas reentradas. Baseie-se no relógio visível no gráfico. O formato deve ser um objeto JSON com "main" (string "HH:mm") e "reentries" (array de strings ["HH:mm", "HH:mm"]).
        6.  'recommendation': Sua recomendação final. Deve ser uma das três opções: "Compra", "Venda" ou "Aguardar".

        REGRAS IMPORTANTES:
        - NUNCA forneça conselhos financeiros. Inicie seu 'summary' com a frase: "Esta é uma análise educacional e não representa uma recomendação de investimento."
        - Foque a análise na vela que está se formando ou na próxima vela. A recomendação é para o curtíssimo prazo.
        - Seja decisivo. Evite linguagem ambígua.
        - Responda APENAS com o objeto JSON. Não inclua texto ou formatação adicional como \`\`\`json.`;
        
        const contents = [{ parts: [imagePart] }];
        
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        asset: { type: Type.STRING },
                        timeframe: { type: Type.STRING },
                        patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                        summary: { type: Type.STRING },
                        entryTime: {
                            type: Type.OBJECT,
                            properties: {
                                main: { type: Type.STRING },
                                reentries: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                        },
                        recommendation: { type: Type.STRING },
                    }
                }
            }
        });

        const analysisResult = JSON.parse(response.text);
        // FIX: Correctly typed res object now has .json() method.
        res.json({ analysis: analysisResult });
    } catch (error) {
        console.error('Erro na rota /api/analyze:', error);
        // FIX: Correctly typed res object now has .status() method.
        res.status(500).json({ error: 'Ocorreu um erro ao processar a análise da IA.' });
    }
});

// Rota para Geração de Fala (TTS)
// FIX: Explicitly typed req and res to use express.Request and express.Response.
app.post('/api/generate-speech', async (req: express.Request, res: express.Response) => {
    try {
        // FIX: Correctly typed req object now has .body property.
        const { text } = req.body;
        if (!text) {
            // FIX: Correctly typed res object now has .status() method.
            return res.status(400).json({ error: 'Texto é obrigatório.' });
        }

        const model = 'gemini-2.5-flash-preview-tts';
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: `Diga com uma voz clara e profissional: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error('Nenhum conteúdo de áudio foi retornado pela API.');
        }

        // FIX: Correctly typed res object now has .json() method.
        res.json({ audioContent: base64Audio });
    } catch (error) {
        console.error('Erro na rota /api/generate-speech:', error);
        // FIX: Correctly typed res object now has .status() method.
        res.status(500).json({ error: 'Ocorreu um erro ao gerar o áudio.' });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor backend ouvindo na porta ${port}`);
        console.log('Endpoints disponíveis:');
        console.log(`- GET  /api/status`);
        console.log(`- POST /api/register`);
        console.log(`- POST /api/login`);
        console.log(`- POST /api/create-checkout-session`);
        console.log(`- POST /api/stripe-webhook`);
        console.log(`- POST /api/analyze`);
        console.log(`- POST /api/generate-speech`);
    });
}

export default app;
