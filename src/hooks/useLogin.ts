import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/accounts/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',  // Mantém cookies de sessão se necessário
      });

      const data = await response.json();  // Captura a resposta JSON da API

      if (!response.ok) {
        // A API pode retornar detalhes do erro no corpo da resposta
        const errorMessage = data?.detail || 'Ocorreu um erro ao efetuar o login';
        throw new Error(errorMessage);
      }

      console.log('Login bem-sucedido:', data);
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);  // Captura e define o erro com a mensagem correta
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
