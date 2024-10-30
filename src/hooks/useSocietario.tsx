import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SocietarioData {
  id: string;
  nome: string;
  idContabilidade: any;
  // Adicione outros campos conforme necessário
}

// Removida a interface CreateSocietarioData já que vamos passar os argumentos separadamente

interface UpdateSocietarioData {
  id: string;
  cnpj?: string;
  status?: string;
  // Adicione outros campos que podem ser atualizados
}

export function useSocietario() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SocietarioData[]>([]);

  // Função auxiliar para fazer requisições
  const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      throw error;
    }
  };

  // Create - Criar novo processo societário com argumentos separados
  const novoRegistro = async (idContabilidade: any, nome: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWithErrorHandling(
        `${API_URL}/societario/novo-registro/`,
        {
          method: 'POST',
          body: JSON.stringify({
            idContabilidade,
            nome
          }),
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Read - Buscar todos os processos
  const getAll = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWithErrorHandling(
        `${API_URL}/societario/`,
        { method: 'GET' }
      );
      setData(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Read - Buscar processo específico
  const getById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWithErrorHandling(
        `${API_URL}/societario/${id}/`,
        { method: 'GET' }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Update - Atualizar processo
  const update = async (updateData: UpdateSocietarioData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWithErrorHandling(
        `${API_URL}/societario/${updateData.id}/`,
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete - Remover processo
  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchWithErrorHandling(
        `${API_URL}/societario/${id}/`,
        { method: 'DELETE' }
      );
      // Atualiza o estado removendo o item deletado
      setData(prevData => prevData.filter(item => item.id !== id));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para limpar erros
  const clearError = () => setError(null);

  return {
    data,
    isLoading,
    error,
    novoRegistro,
    getAll,
    getById,
    update,
    remove,
    clearError,
  };
}