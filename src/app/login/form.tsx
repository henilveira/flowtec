"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, senha);
      toast.success("Login efetuado com sucesso!", {
        description: "Redirecionando para o painel...",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Falha!", {
        description:
          "Ocorreu um erro ao iniciar sua sessão, tente novamente mais tarde.",
        duration: 3000,
      });
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>

      {/* Exibe erro da API se houver algum */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button
        variant="flowtec"
        className="w-full"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
