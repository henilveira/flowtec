import useSWR from 'swr';

// Função para buscar dados da API
const fetcher = (url: string) => fetch(url, {
  credentials: 'include', // Inclui cookies/credenciais na requisição
}).then((res) => {
  if (!res.ok) {
    // Se o status for 401, lançar um erro para que o SWR o capture
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

export const useUser = () => {
  const { data, error } = useSWR('http://127.0.0.1:8000/api/accounts/get-user/', fetcher); // Ajuste o endpoint conforme necessário

  return {
    // Verifica se `data` existe e, em seguida, acessa os campos de forma segura
    primeiroNome: data?.user?.first_name || null,
    ultimoNome: data?.user?.last_name || null,
    email: data?.user?.email || null,
    isAdminContabilidade: data?.user?.is_admin_contabilidade || null,
    isLoading: !error && !data, // Define o estado de carregamento
    isError: error,
  };
};
