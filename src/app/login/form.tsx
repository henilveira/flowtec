'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LoginForm = () => {
    const { login } = useLogin()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const handleLogin = (email, senha) => {
        try {

        }
    }

    return (
    <form className="mt-8 space-y-6">
        <div className="space-y-4">
        <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
        />
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white">
        Entrar
        </Button>
    </form>;
    )
};
