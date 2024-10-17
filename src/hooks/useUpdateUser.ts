import { useState } from 'react';
import { useUser } from './useUser';
import useSWR, { mutate } from 'swr';
import { UpdateUser, User } from '@/@types/User';

const API_URL = 'http://127.0.0.1:8000/api';

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtém as informações do usuário
  const { id } = useUser();

  // Função para atualizar todas as informações do usuário
  const updateUser = async (userData: Partial<UpdateUser>) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();

    // Adiciona os dados do usuário ao formData
    if (userData.first_name) { // Corrigido para "first_name" para corresponder ao backend
      formData.append('first_name', userData.first_name);
    }
    if (userData.last_name) { // Corrigido para "last_name" para corresponder ao backend
      formData.append('last_name', userData.last_name);
    }
    if (userData.profile_picture) { // Corrigido para "profile_picture" para corresponder ao backend
      formData.append('profile_picture', userData.profile_picture);
    }

    try {
      const response = await fetch(`${API_URL}/accounts/update-user/?id=${id}`, {
        method: 'PATCH',
        body: formData, // Envia o FormData no corpo da requisição
        credentials: 'include',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Erro do backend:", errorResponse);
        throw new Error('Failed to update user information');
      }

      const updatedUser = await response.json();
      
      // Atualiza os dados localmente após sucesso
      mutate(`/api/accounts/${id}`); // Use a chave correta

      console.log("Usuário atualizado:", updatedUser); // Para depuração
    } catch (err) {
      console.error(err);
      setError('Failed to update user information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser, // Função para atualizar o usuário
    isLoading, // Status de carregamento
    error, // Possíveis erros
  };
}
