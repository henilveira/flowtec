'use client'

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { COLUMNS, Stage } from "./constantes-cor"

interface ProcessCardProps {
  name: string
  stage: Stage
  process: 'abertura_contratual' | 'abertura_de_empresa' | 'alteracao_contratual' | 'transformacao'
  currentDay: number
  className?: string
}

export default function Card({ 
  name,
  stage,
  process,
  currentDay = 33,
  className
}: ProcessCardProps) {
  const currentColumn = COLUMNS.find(column => column.id === stage)
  
  const stages = [
    {
      id: 'proposta_enviada',
      label: 'Proposta enviada'
    },
    {
      id: 'proposta_aceita',
      label: 'Proposta aceita e formulário enviado'
    },
    {
      id: 'formulario_recebido',
      label: 'Formulário recebido'
    }
  ]

  const currentStageIndex = stages.findIndex(s => s.id === 'proposta_aceita') // exemplo fixo para visualização

  return (
    <div className={cn(
      "flex flex-col gap-3 rounded-xl p-4 text-white min-w-[300px]",
      currentColumn?.color,
      className
    )}>
      <h3 className="text-2xl font-semibold">{name}</h3>
      
      <div className="flex flex-col gap-2">
        {stages.map((s, index) => (
          <div key={s.id} className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/40">
              {index <= currentStageIndex && (
                <Check className="h-4 w-4" />
              )}
            </div>
            <span className={cn(
              "text-sm",
              index <= currentStageIndex && "line-through opacity-80"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-1.5">
        <Progress 
          value={(currentDay / 90) * 100} 
          className="h-1.5 bg-white/20" 
        />
        <div className="flex justify-between text-sm">
          <span>{currentDay}d</span>
          <span>90d</span>
        </div>
      </div>
    </div>
  )
}