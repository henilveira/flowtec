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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: File | null;
}

export default function ProfileSettings() {
  const { primeiroNome, ultimoNome, email, profilePicture } = useUser();
  const { updateUser, isLoading, error } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<UpdateUser>({
    defaultValues: {
      first_name: primeiroNome || "",
      last_name: ultimoNome || "",
      email: email || "",
      avatar: null,
    },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelectedAvatar(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);

      toast("Arquivo selecionado!", {
        description: `Você selecionou ${selectedFile.name}`,
        duration: 3000,
      });
    }
  };

  const handleUpdate = async (data: UpdateUser) => {
    const { avatar, ...userData } = data;

    try {
      if (selectedAvatar) {
        await updateUser({ ...userData, profile_picture: selectedAvatar });
      } else {
        await updateUser(userData);
      }
      toast.success("Perfil atualizado!", {
        description: "Em pouco tempo suas informações vão ser atualizadas.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.success("Erro!", {
        description: "Erro ao atualizar perfil, tente novamente mais tarde.",
        duration: 3000,
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
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarPreview || profilePicture}
                alt="Profile preview"
              />
              <AvatarFallback>
                {primeiroNome?.[0]}
                {ultimoNome?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="">
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
                  fileInputRef.current = e;
                  form.register("avatar").ref(e);
                }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Primeiro nome</Label>
              <Input
                id="first_name"
                placeholder={primeiroNome || ""}
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
                placeholder={ultimoNome || ""}
                {...form.register("last_name", {
                  required: true,
                  minLength: 2,
                })}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="email"
                placeholder={email || ""}
                {...form.register("email")}
                disabled
              />
            </div>
            <Button variant="outline" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
