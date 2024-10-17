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
import { useUser } from "@/hooks/useUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProfileAvatar from "@/components/avatar";
import { Loader2 } from "lucide-react";

// Definição da interface UpdateUser
interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: File | null; // Adiciona o campo avatar à interface
}

export default function ProfileSettings() {
  const { toast } = useToast();

  const { primeiroNome, ultimoNome, email, profilePicture } = useUser();
  const { updateUser, isLoading, error } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null); // Estado para armazenar o arquivo selecionado

  const form = useForm<UpdateUser>({
    defaultValues: {
      first_name: primeiroNome || "",
      last_name: ultimoNome || "",
      email: email || "",
      avatar: null, // Inicializa o campo avatar como null
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
    const { avatar, ...userData } = data; // Remove avatar para a atualização

    try {
      if (selectedAvatar) {
        // Inclui o arquivo selecionado no objeto de atualização
        await updateUser({ ...userData, profile_picture: selectedAvatar });
      } else {
        await updateUser(userData); // Chama a função de atualização com os dados do formulário
      }
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
            <ProfileAvatar className="h-20 w-20" />
            <div className="">
              <Label
                htmlFor="avatar"
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800" // Aciona o clique no botão
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
                  form.register("avatar").ref(e); // Registra o input
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
                placeholder={primeiroNome}
                {...form.register("first_name", {
                  required: true,
                  minLength: 2,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Último nome</Label>
              <Input
                id="last_name"
                placeholder={ultimoNome}
                {...form.register("last_name", {
                  required: true,
                  minLength: 2,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                placeholder={email}
                {...form.register("email")}
                disabled
              />
            </div>
          <Button
            type="submit"
            className="bg-flowtech-gradient text-white"
            disabled={isLoading} // Desabilita o botão enquanto carrega
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    'Salvar alterações'
                )}
          </Button>

          

          {error && <p className="text-red-500">{error}</p>}
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
