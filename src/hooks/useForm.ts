import { useState } from "react";
import axios from "axios";
import { EmpresaForm, FormularioDados } from "@/@types/Formulario";

export function useFormActions() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar novo registro
  const criarAbertura = async (data: FormularioDados) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/societario/create-form-abertura/`,
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
  const criarSocios = async (data: EmpresaForm) => {
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
    criarSocios,
    criarAbertura,
    isLoading,
    error,
  };
}
