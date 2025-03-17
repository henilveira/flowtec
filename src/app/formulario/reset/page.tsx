"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearStoredFormId } from "@/lib/form-storage";

export default function ResetFormPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the form ID from localStorage
    clearStoredFormId();

    toast.success("Formulário reiniciado", {
      description: "Você será redirecionado para o início do formulário",
    });

    // Redirect to the start page
    setTimeout(() => {
      router.push("/formulario/abertura");
    }, 1500);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Reiniciando formulário...</h1>
        <p className="text-gray-600 mb-4">
          Seu progresso anterior foi limpo. Você será redirecionado para o
          início do formulário.
        </p>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
}
