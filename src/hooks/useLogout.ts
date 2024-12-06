import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/accounts/token/logout/`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}