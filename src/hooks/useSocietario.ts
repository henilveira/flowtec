import { useApiBase } from './useApiBase';
import { 
  SocietarioData, 
  CreateSocietarioParams,  
} from '@/@types/Societario'; // You'll need to create this type definition

// Types for different list responses
interface EtapasResponse {
  results: SocietarioData[];
  count: number;
}

interface TipoProcessosResponse {
  results: SocietarioData[];
  count: number;
}

export function useListEtapas() {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<EtapasResponse>(
    `/societario/list-etapas/`
  );

  return {
    etapas: data?.results || [],
    isLoading,
    isError: error,
    mutate,
    isValidating
  };
}

interface TipoProcessosResponse {
  tipo_processo: SocietarioData[]; // Ajuste conforme o formato da API
}

export function useListTipoProcessos() {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<TipoProcessosResponse>(
    `/societario/list-tipo-processo/`
  );

  return {
    tipoProcessos: data?.tipo_processo || [], // Atualize para refletir a estrutura correta
    isLoading,
    isError: error,
    mutate,
    isValidating
  };
}


export function useSocietarioActions() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Create - Novo Registro
  const novoRegistro = async (params: CreateSocietarioParams) => {
    const response = await fetch(`${API_URL}/societario/novo-registro/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  };

  // Get by ID
  const getEtapaById = (id: string) => {
    const { data, error, isLoading } = useApiBase<SocietarioData>(
      `/societario/get-etapa/?id=${id}/`
    );

    return { data, error, isLoading };
  };


  // Delete
  const remove = async (id: string) => {
    const response = await fetch(`${API_URL}/societario/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }

    return true;
  };

  return {
    novoRegistro,
    getEtapaById,
    remove,
  };
}