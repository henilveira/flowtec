import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função para buscar dados da API
const fetcher = (url: string) => fetch(url, {
  credentials: 'include',
}).then((res) => {
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

export const useUser = () => {
  const { data, error } = useSWR(`${API_URL}/accounts/get-user/`, fetcher);

  return {
    id: data?.user.id ?? null,
    primeiroNome: data?.user?.first_name || null,
    ultimoNome: data?.user?.last_name || null,
    email: data?.user?.email || null,
    isAdminContabilidade: data?.user?.is_admin_contabilidade || null,
    profilePicture: data?.user?.profile_picture || null,
    isLoading: !error && !data,
    isError: error,
  };
};
