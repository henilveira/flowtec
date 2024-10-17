'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Certifique-se que está importando o ícone correto
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";

const LoginForm = () => {
    const { login } = useLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); // Define como carregando
        try {
            await login(email, senha);
            console.log('login efetuado com sucesso');
        } catch (error: any) {
            console.log('ocorreu algum erro ao efetuar login', error);
        } finally {
            setIsLoading(false); // Finaliza o carregamento
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
                <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading} // Desabilita o input enquanto carrega
                />
                <Input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading} // Desabilita o input enquanto carrega
                />
            </div>
            <Button
                variant='flowtec'
                className="w-full"
                disabled={isLoading} // Desabilita o botão enquanto carrega
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                    </>
                ) : (
                    'Entrar'
                )}
            </Button>
        </form>
    );
};

export default LoginForm;
