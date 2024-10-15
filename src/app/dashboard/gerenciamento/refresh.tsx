'use client'
import { Button } from "@/components/ui/button"; // Seu botão customizado
import { useListContabilidades } from "@/hooks/useListContabilidade"; // Seu hook customizado
import { RefreshCcw, RotateCcw } from "lucide-react";

export default function RefreshButton() {
  const { mutate, isLoading, isError } = useListContabilidades();

  const handleRefresh = () => {
    mutate(); // Chama a API novamente para recarregar os dados
  };

  return (
    <div>
      {/* Botão de refresh */}
      <Button variant='outline' onClick={handleRefresh}>
        <RotateCcw  className="w-4 h-4"/>
      </Button>
    </div>
  );
}
