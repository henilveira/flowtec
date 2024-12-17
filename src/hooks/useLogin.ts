import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/accounts/token/", {
        email,
        password,
      });
      console.log("Login bem-sucedido:", response.data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Ocorreu um erro ao efetuar o login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
