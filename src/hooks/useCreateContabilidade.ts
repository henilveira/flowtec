import { useState } from "react";
import axiosInstance from "@/lib/axios";

export function useCreateContabilidade() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (cnpj: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/contabilidades/create-contabilidade/",
        { cnpj },
      );
      console.log(response.data);
      return response.data; // Retorna os dados em caso de sucesso
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Erro ao criar contabilidade";
      setError(errorMessage);
      throw new Error(errorMessage); // Lança o erro para ser capturado no componente
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
