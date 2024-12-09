import { useState } from 'react';
import { useApiBase } from './useApiBase';
import { 
  SocietarioData, 
  CreateSocietarioParams,  
  ProcessosResponse,
  Processo,
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

// Hook para buscar processos por ID
export function useProcessosById(id: string) {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<{ processo: Processo }>(
    `/societario/get-processo/?processo_id=${id}`
  );

  return {
    tarefas: data?.processo.tarefas,
    processo: data?.processo,  // Extract nested processo
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

// Hook para buscar processos por etapas
export function useProcessosByEtapas() {
  const { data, error, mutate, isLoading } = useApiBase<{ processos_por_etapa: any[] }>('/societario/list-processos-etapas/');

  return {
    processos: data?.processos_por_etapa || [],
    mutate,
    isLoading,
    error
  };
}

// Hook para obter Etapa por ID
export function useEtapaById(id: string) {
  const { data, error, isLoading } = useApiBase<SocietarioData>(
    `/societario/get-etapa/?id=${id}`
  );

  return { data, error, isLoading };
}

// Funções de Ações Societárias
export function useSocietarioActions() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar novo registro
  const novoRegistro = async (
    nome: string,
    contabilidade_id: any,
    tipo_processo_id: string,
    etapa_id: string
  ) => {
    setError(null);
    setIsLoading(true);  // Definido aqui para iniciar o carregamento

    try {
      const response = await fetch(`${API_URL}/societario/create-processo/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          contabilidade_id,
          tipo_processo_id,
          etapa_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar novo registro");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      setError(error.message);  // Captura e define o erro com a mensagem correta
    } finally {
      setIsLoading(false);  // Definido para garantir que o estado de carregamento seja desativado
    }
  };

  const updateProcesso = async ({
    processo_id,
    tarefas,
  }: {
    processo_id: string;
    tarefas: { tarefa_id: string; status: string }[];
  }) => {
    setError(null);
    setIsLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/societario/update-processo/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processo_id,
          tarefas,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar o processo");
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      setError(error.message); // Armazena o erro no estado, se necessário
      throw error; // Re-throws the error to be caught in handleSave
    } finally {
      setIsLoading(false);  // Garante que o carregamento será desativado
    }
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
    updateProcesso,
    isLoading,
    novoRegistro,
    remove,
  };
}