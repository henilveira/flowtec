"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HiClipboardCheck } from "react-icons/hi";
import { getStoredFormId, clearStoredFormId } from "@/lib/form-storage";
import { useEffect, useState } from "react";

export default function FormularioFinalizado() {
  const router = useRouter();
  const [formId, setFormId] = useState<string | null>(null);

  // Recuperar o ID do formulário do localStorage quando a página carregar
  useEffect(() => {
    const savedId = getStoredFormId();
    setFormId(savedId);
  }, []);

  // Função para limpar o ID e voltar ao dashboard
  const handleGoToDashboard = () => {
    clearStoredFormId(); // Limpar o ID do localStorage
    router.push("/dashboard");
  };

  // Função para visualizar o formulário
  const handleViewForm = () => {
    router.push("/formulario/visualizar");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <HiClipboardCheck className="text-green-600 w-10 h-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Formulário enviado com sucesso!
        </h1>
        <p className="text-gray-600 mb-6">
          Seu formulário foi recebido e está sendo processado por nossa equipe.
          {formId && (
            <span className="block mt-2 font-medium">
              ID do processo: {formId}
            </span>
          )}
        </p>
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleViewForm}>
            Ver formulário
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleGoToDashboard}
          >
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}