import { useState } from "react";
import axios from "axios";
import {
  Socios,
  FormularioDados,
  GetFormularioResponse,
} from "@/@types/Formulario";
import { useApiBase } from "./useApiBase";
import axiosInstance from "@/lib/axios";
import { storeFormId } from "@/lib/form-storage";

export const useFormById = (id: string | null) => {
  const { data, error, isLoading } = useApiBase<GetFormularioResponse>(
    `/societario/get-form-abertura/?form_id=${id}` // Certifique-se de que este endpoint está correto
  );

  return {
    formulario: data?.formulario || null, // Atualize para refletir a estrutura correta
    isLoading,
    isError: error,
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFormActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criarAbertura = async (data: FormularioDados) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        `/societario/create-form-abertura/`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const id = response.data.formulario.id;
      storeFormId(id); // Salvar ID diretamente no localStorage
      return {
        id: id,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const criarSocios = async (data: Socios) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/societario/create-socios/`,
        data, // Removido o { data } e enviando os dados diretamente
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      // Melhorando o tratamento de erro
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      throw error; // Importante re-throw do erro para o componente tratar
    } finally {
      setIsLoading(false);
    }
  };

  return {
    useFormById,
    criarSocios,
    criarAbertura,
    isLoading,
    error,
  };
}
