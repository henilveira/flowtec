import { useApiBase } from './useApiBase';
import { 
  SocietarioData, 
  CreateSocietarioParams,  
} from '@/@types/Societario'; // Certifique-se de criar este tipo em `@/@types/Societario`

// Types para diferentes respostas de listagem
interface EtapasResponse {
  results: SocietarioData[]; // Verifique se o tipo SocietarioData reflete o formato esperado da API
  count: number;
}

interface TipoProcessosResponse {
  tipo_processo: SocietarioData[]; // Verifique se está correto conforme a API
}

interface EtapasResponse {
  etapas: { 
    id: string; 
    nome: string; 
    ordem: number; 
  }[]; // Define o formato correto da propriedade etapas
}


// Hook para listar Etapas
export function useListEtapas() {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<EtapasResponse>(
    `/societario/list-etapas/`
  );

  return {
    etapas: data?.etapas || [], // Agora corretamente acessando `etapas`
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}



// Hook para listar Tipo de Processos
export function useListTipoProcessos() {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<TipoProcessosResponse>(
    `/societario/list-tipo-processo/` // Certifique-se de que este endpoint está correto
  );

  return {
    tipoProcessos: data?.tipo_processo || [], // Atualize para refletir a estrutura correta
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}

// Funções de Ações Societárias
export function useSocietarioActions() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Criar novo registro
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

  // Obter Etapa por ID
  const getEtapaById = (id: string) => {
    const { data, error, isLoading } = useApiBase<SocietarioData>(
      `/societario/get-etapa/?id=${id}` // Verifique o endpoint, removendo a barra extra após o ID
    );

    return { data, error, isLoading };
  };

  // Remover registro
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
