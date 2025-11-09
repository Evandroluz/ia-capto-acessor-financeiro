import type { AnalysisResult, User } from '../types';

const API_BASE_URL = '/api'; // Caminho relativo para funcionar em produção e localmente.

// --- INTERFACES DE RESPOSTA ---
interface AnalyzeChartResponse {
    analysis?: AnalysisResult;
    error?: string;
}
interface AuthResponse {
    user?: User;
    error?: string;
}
interface CheckoutResponse {
    url?: string;
    error?: string;
}
interface SpeechResponse {
    audioContent?: string;
    error?: string;
}
interface StatusResponse {
    status?: 'ok';
    error?: string;
}

/**
 * Helper function to perform fetch requests with a timeout.
 * This prevents the UI from getting stuck in a loading state indefinitely.
 * @param url The URL to fetch.
 * @param options The request options.
 * @param timeout The timeout in milliseconds.
 * @returns A promise that resolves with the fetch Response.
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 25000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error; // Re-throw to be handled by the calling function
    }
};

/**
 * Handles API errors, including timeout errors from AbortController.
 * @param error The error object.
 * @param context A string describing the context of the error (e.g., "analyzeChart").
 * @returns An error object with a user-friendly message.
 */
const handleApiError = (error: any, context: string): { error: string } => {
    console.error(`API Error (${context}):`, error);
    if (error.name === 'AbortError') {
        return { error: 'O servidor demorou muito para responder. Por favor, tente novamente.' };
    }
    // Provide a more helpful error message for development environments.
    return { error: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em um terminal separado (veja as instruções em `server/index.ts`).' };
};

// Function to check if the backend server is online
export const checkServerStatus = async (): Promise<StatusResponse> => {
    try {
        // Use a short timeout for the status check
        const response = await fetchWithTimeout(`${API_BASE_URL}/status`, {
            method: 'GET',
        }, 3000); // 3-second timeout
        if (!response.ok) {
            return { error: 'O servidor respondeu com um erro.' };
        }
        const data = await response.json();
        return { status: data.status };
    } catch (error) {
        // This will catch "Failed to fetch"
        return { error: 'Não foi possível conectar ao servidor.' };
    }
};

// Function to analyze the chart image
export const analyzeChart = async (payload: { imageData: string; mimeType: string; userEmail: string; }): Promise<AnalyzeChartResponse> => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }, 25000); // 25 second timeout for AI analysis
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Ocorreu um erro desconhecido no servidor.' };
        }
        return { analysis: data.analysis };
    } catch (error) {
        return handleApiError(error, 'analyzeChart');
    }
};

// Function to generate speech from text
export const generateSpeech = async (text: string): Promise<SpeechResponse> => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/generate-speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        }, 15000); // 15 second timeout for TTS
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Ocorreu um erro desconhecido no servidor.' };
        }
        return { audioContent: data.audioContent };
    } catch (error) {
        return handleApiError(error, 'generateSpeech');
    }
};

// Function to register a new user
export const register = async (email: string): Promise<AuthResponse> => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        }, 15000); // 15 second timeout for auth
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Ocorreu um erro desconhecido no servidor.' };
        }
        return { user: data.user };
    } catch (error) {
        return handleApiError(error, 'register');
    }
};

// Function to log in a user
export const login = async (email: string): Promise<AuthResponse> => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        }, 15000); // 15 second timeout for auth
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Ocorreu um erro desconhecido no servidor.' };
        }
        return { user: data.user };
    } catch (error) {
        return handleApiError(error, 'login');
    }
};

// Function to create a Stripe checkout session
export const createCheckoutSession = async (plan: string, userEmail: string): Promise<CheckoutResponse> => {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, userEmail }),
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Ocorreu um erro desconhecido no servidor.' };
        }
        return { url: data.url };
    } catch (error) {
        return handleApiError(error, 'createCheckoutSession');
    }
};