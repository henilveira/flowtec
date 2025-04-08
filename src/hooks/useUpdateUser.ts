import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função de parser de erros
  const errorParser = (errorData: any): string => {
    // 1. Verifica erros específicos do campo de imagem
    if (errorData.profile_picture) {
      if (Array.isArray(errorData.profile_picture)) {
        return errorData.profile_picture[0];
      }
      if (typeof errorData.profile_picture === "string") {
        return errorData.profile_picture;
      }
    }

    // 2. Verifica erros gerais
    if (errorData.detail) {
      if (typeof errorData.detail === "string") return errorData.detail;
      if (Array.isArray(errorData.detail)) return errorData.detail.join(", ");
    }

    // 3. Verifica erros de validação de campos
    const fieldErrors = Object.values(errorData).flatMap((messages) => {
      if (Array.isArray(messages)) return messages;
      return [messages];
    });

    if (fieldErrors.length > 0) {
      return fieldErrors.join(", ");
    }

    // 4. Fallback para formato desconhecido
    return JSON.stringify(errorData, null, 2);
  };

  const updateUser = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch(
        "/accounts/update-user/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      mutate("/accounts/current-user/");
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data
        ? errorParser(err.response.data)
        : "Erro na comunicação com o servidor";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error };
}