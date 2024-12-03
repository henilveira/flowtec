'use client'

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { COLUMNS } from "./constantes-cor"
import { Etapa, TipoProcesso } from "@/@types/Societario"

interface ProcessCardProps {
  id?: string
  nome: string
  etapa: Etapa
  tipoProcesso: TipoProcesso
  diaAtual: number
  diaInicio: string
  className?: string
}

export default function Card({ 
  nome,
  etapa,  
  tipoProcesso,  
  diaAtual,
  diaInicio,  
  className
}: ProcessCardProps) {
  const currentColumn = COLUMNS.find(column => column.id === etapa.id)

  return (
    <div className={cn(
      "flex flex-col bg-flowtech-blue gap-4 text-white rounded-xl p-6 w-full min-w-[280px] shadow-lg transition-all duration-300 ease-in-out",
      "hover:shadow-xl hover:translate-y-[-4px]",
      currentColumn?.color,
      className
    )}>
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold tracking-tight">{nome}</h3> 
        <Badge 
          className="text-sm font-medium px-3 py-1 rounded-full bg-white/20 text-white border-none shadow-sm"
        >
          {tipoProcesso.descricao}
        </Badge>
      </div>
      
      <div className="mt-auto space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>{diaAtual} dias</span>
          <span>Meta: 90 dias</span>
        </div>
        <Progress 
          value={(diaAtual / 90) * 100} 
          className="h-2 bg-white/30" 
        />
        <div className="flex justify-between text-xs text-white/70">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

