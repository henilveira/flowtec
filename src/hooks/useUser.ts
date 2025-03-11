import { useApiBase } from "./useApiBase"; // Ajuste o caminho de importação conforme necessário

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
  const { data, error, isLoading } = useApiBase<UserResponse>(
    "/accounts/get-user/",
  );

  return {
    id: data?.user.id ?? "",
    primeiroNome: data?.user?.first_name ?? "",
    ultimoNome: data?.user?.last_name ?? "",
    email: data?.user?.email ?? "",
    isAdminContabilidade: data?.user?.is_admin_contabilidade ?? false,
    profilePicture: data?.user?.profile_picture ?? "",
    isLoading,
    isError: error ? String(error) : null,
  };
};
