"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { COLUMNS } from "./constantes-cor";
import { Etapa, TipoProcesso } from "@/@types/Societario";

interface ProcessCardProps {
  id?: string;
  nome: string;
  etapa: string;
  tipoProcesso: any;
  diaAtual: number;
  diaInicio: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Card({
  nome,
  etapa,
  tipoProcesso,
  diaAtual,
  diaInicio,
  className,
  onClick,
  disabled = false,
}: ProcessCardProps) {
  const currentColumn = COLUMNS.find((column) => column.id === etapa);

  // Determina as cores com base nos dias
  const getColor = () => {
    if (diaAtual <= 30) return "green-500";
    if (diaAtual <= 60) return "yellow-500";
    return "red-500";
  };

  // Determina a cor de fundo da barra de progresso
  const getProgressBarBackground = () => {
    if (diaAtual <= 30) return "bg-green-500/30";
    if (diaAtual <= 60) return "bg-yellow-500/30";
    return "bg-red-500/30";
  };

  // Mapeamento de cores para classes Tailwind completas
  const colorMap = {
    "green-500": "bg-green-500",
    "yellow-500": "bg-yellow-500", 
    "red-500": "bg-red-500"
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "flex flex-col bg-flowtech-blue gap-4 text-white rounded-xl p-6 w-full min-w-[280px] shadow-lg transition-all duration-300 ease-in-out",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-xl hover:translate-y-[-4px]",
        currentColumn?.color,
        className
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold tracking-tight">{nome}</h3>
        <Badge
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full text-white border-none text-center",
            colorMap[getColor()]
          )}
        >
          {tipoProcesso.descricao}
        </Badge>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>{diaAtual} dia(s)</span>
          <span>90 dias</span>
        </div>
        <div 
          className={cn(
            "h-2 rounded-full overflow-hidden",
            getProgressBarBackground()
          )}
        >
          <div 
            className={cn(
              "h-full", 
              colorMap[getColor()]
            )} 
            style={{ 
              width: `${Math.min((diaAtual / 90) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}