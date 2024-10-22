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

    console.log(email,password)
    try {
      const response = await fetch(`${API_URL}/accounts/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      
      if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();
        console.log(data)
      router.push('/dashboard'); // Redirect to dashboard or home page
    } catch (error:any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}