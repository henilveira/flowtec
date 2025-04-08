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
import React, { memo } from "react";

interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
}

const MemoizedProfileSettings = memo(function ProfileSettings() {
  const { primeiroNome, ultimoNome, email, profilePicture } = useUser();
  const { updateUser, isLoading, error } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<UpdateUser>({
    defaultValues: {
      first_name: primeiroNome || "",
      last_name: ultimoNome || "",
      email: email || "",
    },
  });

  // Simplified file change handler
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (!file) {
      setSelectedAvatar(null);
      setAvatarPreview(null);
      return;
    }
    
    setSelectedAvatar(file);
    
    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setAvatarPreview(result);
      }
    };
    fileReader.readAsDataURL(file);
    
    toast("Arquivo selecionado!", {
      description: `Você selecionou ${file.name}`,
      duration: 3000,
    });
  };

  // Clear selected file
  const clearFileSelection = () => {
    setSelectedAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleUpdate = async (data: UpdateUser) => {
    try {
      const formData = new FormData();
      
      // Campos textuais
      formData.append("first_name", data.first_name || "");
      formData.append("last_name", data.last_name || "");
      
      // Campo do arquivo com o nome que o backend espera
      if (selectedAvatar) {
        formData.append("profile_picture", selectedAvatar); // Nome corrigido
      }
  
      await updateUser(formData);
      
      toast.success("Perfil atualizado!", {
        description: "Foto e dados salvos com sucesso",
        duration: 3000,
      });
  
      // Resetar estados
      setSelectedAvatar(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro na atualização", {
        description: error instanceof Error ? error.message : "Erro no envio da foto",
        duration: 5000,
      });
    }
  };

  // Determine avatar source
  const avatarSrc = avatarPreview || profilePicture || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize seus dados de perfil aqui.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className="flex items-center space-x-4 mb-2">
            <Avatar className="h-20 w-20">
              {avatarSrc ? (
                <AvatarImage
                  src={avatarSrc}
                  alt="Profile preview"
                />
              ) : null}
              <AvatarFallback>
                {primeiroNome?.[0]}
                {ultimoNome?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Alterar foto de perfil
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {selectedAvatar && (
                <button
                  type="button"
                  onClick={clearFileSelection}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover foto selecionada
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Primeiro nome</Label>
              <Input
                id="first_name"
                placeholder={primeiroNome || ""}
                {...register("first_name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres"
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Último nome</Label>
              <Input
                id="last_name"
                placeholder={ultimoNome || ""}
                {...register("last_name", {
                  required: "Sobrenome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres"
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                value={email || ""}
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
});

export default MemoizedProfileSettings;