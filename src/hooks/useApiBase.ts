import useSWR, { SWRConfiguration } from 'swr';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/@types/ApiBase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetcher(url: string) {
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error: ApiError = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data;
}

export function useApiBase<T>(
  endpoint: string | null, // Permite passar null para não fazer requisição
  options: SWRConfiguration<T> = {}
) {
  const router = useRouter();

  // Use uma chave estável que só muda quando o endpoint realmente muda
  const key = endpoint ? `${API_URL}${endpoint}` : null;

  const { data, error, mutate, isValidating } = useSWR<T>(
    key, 
    key ? fetcher : null,  // Passa null como fetcher se key for null
    {
      ...options,
      
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      
      dedupingInterval: 60000,
      refreshInterval: 0,
      
      onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
        if ((err as ApiError).status === 401) {
          if (retryCount < 1) {
            revalidate();
          } else {
            router.push('/login');
          }
          return;
        }

        return;
      },
    }
  );

  return { 
    data, 
    error, 
    mutate, 
    isLoading: !error && !data, 
    isValidating 
  };
}