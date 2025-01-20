import { useState } from "react";
import axios from "axios";
import { useApiBase } from "./useApiBase";
import {
  SocietarioData,
  CreateSocietarioParams,
  ProcessosResponse,
  Processo,
} from "@/@types/Societario"; // Certifique-se de criar este tipo em `@/@types/Societario`

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
  const { data, error, mutate, isLoading, isValidating } =
    useApiBase<EtapasResponse>(`/societario/list-etapas/`);

  return {
    etapas: data?.etapas || [], // Agora corretamente acessando `etapas`
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}

// Hook para buscar processos por ID
export function useProcessosById(id: string | null) {
  const { data, error, mutate, isLoading, isValidating } = useApiBase<{
    processo: Processo;
  }>(
    id ? `/societario/get-processo/?processo_id=${id}` : null, // Não faz a requisição se o id for null
    {
      revalidateOnMount: true, // Revalida ao montar
    },
  );

  return {
    tarefas: data?.processo.tarefas,
    processo: data?.processo, // Extract nested processo
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}

// Hook para listar Tipo de Processos
export function useListTipoProcessos() {
  const { data, error, mutate, isLoading, isValidating } =
    useApiBase<TipoProcessosResponse>(
      `/societario/list-tipo-processo/`,
      {
        revalidateOnMount: true, // Revalida ao montar
      }, // Certifique-se de que este endpoint está correto
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
  const { data, error, mutate, isLoading } = useApiBase<{
    processos_por_etapa: any[];
  }>("/societario/list-processos-etapas/");

  return {
    processos: data?.processos_por_etapa || [],
    mutate,
    isLoading,
    error,
  };
}

// Hook para obter Etapa por ID
export function useEtapaById(id: string) {
  const { data, error, isLoading } = useApiBase<SocietarioData>(
    `/societario/get-etapa/?id=${id}`,
  );

  return { data, error, isLoading };
}

interface UpdateProcessoRequest {
  processo_id: string;
  etapa_id: string;
  tarefas: {
    tarefa_id: string;
    concluida: string;
  }[];
}

// Funções de Ações Societárias
export function useSocietarioActions() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState<string | null>(null);
  const [errorUpdate, setErrorUpdate] = useState<string | null>(null);
  const [processId, setProcessId] = useState<string | null>(null);

  // Criar novo registro
  const novoRegistro = async (
    nome: string,
    contabilidade_id: any,
    tipo_processo_id: string,
    etapa_id: string,
  ) => {
    setErrorRegistro(null);
    setIsLoading(true); // Definido aqui para iniciar o carregamento

    try {
      const response = await axios.post(
        `${API_URL}/societario/create-processo/`,
        {
          nome,
          contabilidade_id,
          tipo_processo_id,
          etapa_id,
        },
        {
          withCredentials: true, // Inclui os cookies de autenticação
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setProcessId(response.data.processo.id);

      return response.data;
    } catch (error: any) {
      setErrorRegistro(error.message); // Captura e define o erro com a mensagem correta
    } finally {
      setIsLoading(false); // Definido para garantir que o estado de carregamento seja desativado
    }
  };

  const updateProcesso = async (data: UpdateProcessoRequest) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/societario/update-processo/`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      setErrorUpdate(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remover registro
  const remove = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/societario/${id}/`, {
        withCredentials: true, // Inclui os cookies de autenticação
      });
      return true;
    } catch (error: any) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.message ||
          `Request failed with status ${error.response?.status}`,
      );
    }
  };

  return {
    errorRegistro,
    errorUpdate,
    updateProcesso,
    isLoading,
    novoRegistro,
    remove,
    processId,
  };
}
