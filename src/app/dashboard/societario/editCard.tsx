'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet"
import { Clock, CalendarIcon, Copy, FileText } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Enhanced type definitions with optional chaining and more robust typing
interface Processo {
  id: string
  nome: string
  contabilidade: {
    id: string
    cnpj: number
    nome: string
  }
  tipo_processo: {
    id: string
    descricao: string
  }
  etapa_atual?: {
    id: string
    nome: string
    ordem: number
  }
  etapa_inicial?: {
    id: string
    nome: string
    ordem: number
  }
  expire_at: string
  created_at: string
}

interface EditSheetProps {
  processo: Processo
  onSave: (processo: any) => void
  onCancel?: () => void
}

const calcularDiasPassados = (startDate: string): number => {
  const dataInicio = new Date(startDate)
  const dataAtual = new Date()
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime()
  return Math.floor(diferencaEmMs / (1000 * 3600 * 24))
}

const etapas = [
  { id: '1', nome: 'Proposta', tarefas: ['Enviar proposta', 'Revisar proposta', 'Aprovar proposta'] },
  { id: '2', nome: 'Documentação', tarefas: ['Coletar documentos', 'Verificar documentos', 'Arquivar documentos'] },
  { id: '3', nome: 'Análise', tarefas: ['Analisar processo', 'Elaborar parecer', 'Revisar análise'] },
  { id: '4', nome: 'Conclusão', tarefas: ['Preparar relatório final', 'Obter aprovações', 'Arquivar processo'] },
]

export default function EditSheet({
  processo,
  onSave,
  onCancel,
}: EditSheetProps) {
  const [tasks, setTasks] = useState(
    etapas.map(etapa => ({
      id: etapa.id,
      nome: etapa.nome,
      tarefas: etapa.tarefas.map((tarefa, index) => ({
        id: `${etapa.id}-${index}`,
        label: tarefa,
        checked: false
      }))
    }))
  )
  const formLink = "forms.com.br/formulario/939887/bxg93ky4tgj8"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formLink)
  }

  const handleSave = () => {
    onSave({
      ...processo,
      tasks,
    })
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const handleTaskChange = (etapaId: string, tarefaId: string, checked: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(etapa => 
        etapa.id === etapaId
          ? {
              ...etapa,
              tarefas: etapa.tarefas.map(tarefa =>
                tarefa.id === tarefaId ? { ...tarefa, checked } : tarefa
              )
            }
          : etapa
      )
    )
  }

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open && onCancel) {
          onCancel()
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-[800px] sm:w-[740px] flex flex-col h-full overflow-y-auto"
      >
        <div className="flex-grow">
          <div className="flex justify-start items-center mb-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <div>
                <Badge variant="secondary" className="text-sm">
                  {processo.etapa_atual?.nome || 'Etapa não definida'}
                </Badge>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{processo.nome}</h1>
                <p className="italic text-muted-foreground text-sm">
                  {processo.contabilidade.nome}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Dias corridos
                </Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {calcularDiasPassados(processo.created_at)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Tipo de processo
                </Label>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="">
                    {processo.tipo_processo.descricao}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de início
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de conclusão
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.expire_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {tasks.map((etapa) => (
                  <AccordionItem value={etapa.id} key={etapa.id}>
                    <AccordionTrigger>{etapa.nome}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {etapa.tarefas.map((tarefa) => (
                          <div key={tarefa.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={tarefa.id}
                              checked={tarefa.checked}
                              onCheckedChange={(checked) => 
                                handleTaskChange(etapa.id, tarefa.id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={tarefa.id}
                              className={`text-sm leading-none ${
                                tarefa.checked
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {tarefa.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="space-y-2 my-6">
            <Label className="text-sm text-muted-foreground">
              Link para formulário
            </Label>
            <div className="flex space-x-2">
              <Input readOnly value={formLink} className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 flex justify-end sm:justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="default" type="submit">
            Salvar alterações
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}