import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userData: Partial<Record<string, any>>) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    try {
      const response = await axiosInstance.patch(
        "/accounts/update-user/",
        formData,
      );
      mutate("/accounts/current-user/");
      console.log("Usuário atualizado:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao atualizar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error };
}
