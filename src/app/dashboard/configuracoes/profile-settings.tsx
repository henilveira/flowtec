"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser"; // Importando o hook que busca dados do usuário
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";
import ProfileAvatar from "@/components/avatar";

// Definição da interface UpdateUser
interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: File | null; // Atualizando o campo para corresponder ao seu código
}

export default function ProfileSettings() {
  const { toast } = useToast();
  const {
    id,
    primeiroNome,
    ultimoNome,
    email,
    profilePicture,
    isLoading: isUserLoading,
  } = useUser(); // Obtendo dados do usuário
  const { updateUser, isLoading, error } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null); // Estado para armazenar o arquivo selecionado

  const form = useForm<UpdateUser>({
    defaultValues: {
      first_name: primeiroNome || "",
      last_name: ultimoNome || "",
      email: email || "",
      profile_picture: null, // Inicializa o campo profile_picture como null
    },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelectedAvatar(selectedFile); // Armazena o arquivo selecionado no estado
      toast({
        title: "Arquivo selecionado",
        description: `Você selecionou ${selectedFile.name}`,
        variant: "default",
      });
    }
  };

  const handleUpdate = async (data: UpdateUser) => {
    const { profile_picture, ...userData } = data;

    // Atualização otimista
    const updatedUser = {
      id,
      first_name: data.first_name || primeiroNome,
      last_name: data.last_name || ultimoNome,
      email: data.email || email,
      profile_picture: selectedAvatar || null, // Define como null se não houver um arquivo
    };

    // Atualiza o estado local com os novos dados
    mutate("http://127.0.0.1:8000/api/accounts/get-user/", updatedUser, false);

    try {
      await updateUser({
        ...userData,
        profile_picture: selectedAvatar || undefined,
      }); // Passa undefined se selectedAvatar for null
      toast({
        title: "Perfil atualizado com sucesso!",
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil.",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize seus dados de perfil aqui.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="flex items-center space-x-4 mb-2">
            <ProfileAvatar className="w-20 h-20" />
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
                ref={(e) => {
                  fileInputRef.current = e; // Atualiza o ref
                  form.register("profile_picture").ref(e); // Registra o input
                }}
                onChange={handleFileChange} // Adiciona o manipulador de mudança
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Primeiro nome</Label>
              <Input
                id="first_name"
                {...form.register("first_name", { required: true })}
                placeholder={primeiroNome}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Sobrenome</Label>
              <Input
                id="last_name"
                {...form.register("last_name", { required: true })}
                placeholder={ultimoNome}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled
                {...form.register("email", { required: false })}
                placeholder={email}
              />
            </div>
            <Button
              type="submit"
              variant="flowtec"
              disabled={isLoading || isUserLoading || !id} // Desabilita se o id não estiver disponível
            >
              {isLoading ? "Atualizando..." : "Atualizar perfil"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
