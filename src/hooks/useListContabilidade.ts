import { useApiBase } from "./useApiBase";
import {
  ContabilidadeResponse,
  useListContabilidadesReturn,
} from "@/@types/Contabilidades";

export function useListContabilidades(
  page: number = 1,
): useListContabilidadesReturn {
  const { data, error, mutate, isLoading, isValidating } =
    useApiBase<ContabilidadeResponse>(
      `/contabilidades/list-contabilidades/?page=${page}`,
    );

  return {
    companies: data?.results.empresas || [],
    totalPages: data ? Math.ceil(data.count / 8) : 0,
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
