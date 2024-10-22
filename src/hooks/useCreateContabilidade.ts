import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCreateContabilidade() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (cnpj: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/contabilidades/create-contabilidade/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj }),
        credentials: 'include',
      });
      
      
      if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();
        console.log(data)
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}