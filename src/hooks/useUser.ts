import { useApiBase } from './useApiBase'; // Ajuste o caminho de importação conforme necessário

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface para tipar a resposta da API
interface UserResponse {
  user: {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    is_admin_contabilidade: boolean | null;
    profile_picture: string | null;
  };
}

export const useUser = () => {
  const { data, error, isLoading } = useApiBase<UserResponse>('/accounts/get-user/');

  return {
    id: data?.user.id ?? null,
    primeiroNome: data?.user?.first_name || null,
    ultimoNome: data?.user?.last_name || null,
    email: data?.user?.email || null,
    isAdminContabilidade: data?.user?.is_admin_contabilidade || null,
    profilePicture: data?.user?.profile_picture || null,
    isLoading,
    isError: error,
  };
};