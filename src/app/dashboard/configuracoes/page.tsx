"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";

export default function CompactUserSettings() {
  const { primeiroNome, ultimoNome, email, isAdminContabilidade } = useUser();

  const [associatedAccounts] = useState([
    { id: 1, name: "Johnson & Co. Accounting" },
    { id: 2, name: "Smith Financial Services" },
    { id: 3, name: "Global Tax Solutions" },
  ]);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Configurações da conta</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Atualize seus dados de perfil aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={primeiroNome} alt="nome do usuario" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Alterar foto de perfil
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={`${primeiroNome} ${ultimoNome}`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} />
            </div>
            <Button className="bg-flowtech-gradient text-white">Salvar alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de privacidade</CardTitle>
            <CardDescription>
              Gerencie suas informações sensíveis aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Senha nova</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha nova</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button variant='outline' className="">Alterar senha</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contabilidades associadas</CardTitle>
            <CardDescription>
              Veja e gerencie as contabilidades que você está associado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {associatedAccounts.map((account) => (
                <li
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span>{account.name}</span>
                  <Button variant="outline" size="sm">
                    Gerenciar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
            <CardDescription>Customize suas preferencias.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails">
                Receba e-mails de atualizações de estado das suas requisições
              </Label>
              <Switch id="marketing-emails" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor-auth">
                Ativar autenticação de dois fatores
              </Label>
              <Switch id="two-factor-auth" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="account-activity">
                Notificar minhas atividades
              </Label>
              <Switch id="account-activity" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
