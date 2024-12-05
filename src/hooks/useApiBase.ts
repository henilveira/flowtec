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

  const { data, error, mutate, isValidating } = useSWR<T>(
    endpoint ? `${API_URL}${endpoint}` : null, // Só faz requisição se endpoint não for null
    fetcher,
    {
      ...options,
      
      // Configurações para otimização de performance
      revalidateOnFocus: false, // Desativa revalidação quando a janela ganha foco
      revalidateOnReconnect: false, // Desativa revalidação quando reconecta internet
      shouldRetryOnError: false, // Desativa retry automático em erros
      
      // Configuração de cache e tempo de revalidação
      dedupingInterval: 60000, // 1 minuto de cache para requisições idênticas
      refreshInterval: 0, // Desativa polling automático
      
      // Estratégia de erro e retry personalizada
      onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
        // Verifica se o erro é 401 (não autorizado)
        if ((err as ApiError).status === 401) {
          // Tenta novamente até 1 vez
          if (retryCount < 1) {
            revalidate();
          } else {
            // Redireciona para login após falhas consecutivas
            router.push('/login');
          }
          return;
        }

        // Não retentar para outros tipos de erro
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