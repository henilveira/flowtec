'use client'

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { COLUMNS, Stage } from "./constantes-cor"
import { Checkbox } from "@/components/ui/checkbox"

interface ProcessCardProps {
  name: string
  stage: Stage
  process: 'abertura_contratual' | 'abertura_de_empresa' | 'alteracao_contratual' | 'transformacao'
  currentDay: number
  startDate: string
  tasks: { label: string, checked: boolean }[] // Tarefas passadas como propriedade
  className?: string
}

export default function Card({ 
  name,
  stage,
  process,
  currentDay = 33,
  startDate,
  tasks,
  className
}: ProcessCardProps) {
  const currentColumn = COLUMNS.find(column => column.id === stage)
  
  return (
    <div className={cn(
      "flex flex-col gap-3 rounded-xl p-4 text-white w-full min-w-[280px] transition-transform transform hover:scale-105 hover:bg-opacity-90 cursor-pointer",
      currentColumn?.color,
      className
    )}>
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <Badge 
          className="text-sm font-medium px-2 py-1 rounded-full bg-white/10 text-white border-none"
        >
          {process.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Badge>
      </div>
      
      

      {/* Exibindo tarefas abaixo do nome do processo */}
      <div className="space-y-2 mt-2">
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox 
                checked={task.checked} 
                disabled 
                className="text-white" 
              />
              <span className={cn("text-sm", task.checked ? "line-through text-white/70" : "text-white/90")}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
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
