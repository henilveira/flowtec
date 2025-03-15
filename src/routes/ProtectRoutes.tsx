"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner'
import FlowtecAuthLoader from "@/app/login/loader";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { id, isLoading, isError } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificação inicial de autenticação
    if (!isLoading) {
      // Se houver erro na requisição ou usuário não tiver ID válido
      if (isError || !id) {
        // Redireciona para o login
        router.push("/login");
        toast.error("Sessão expirada!", {
          description: "Desculpe, mas é assim que temos que jogar o jogo :(",
        });
      } else {
        // Usuário está autenticado
        setIsAuthorized(true);
        toast.success("Pode ir campeão!", {
          description: "Preservamos sua sessão com carinho...",
        });
      }
    }
  }, [isLoading, isError, id, router]);

  // Mostra loader enquanto verifica autenticação
  if (isLoading || isAuthorized === null) {
    return (
      <FlowtecAuthLoader />
    );
  }

  // Se autorizado, mostra o conteúdo da página
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;