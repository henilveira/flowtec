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
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao criar contabilidade");
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
