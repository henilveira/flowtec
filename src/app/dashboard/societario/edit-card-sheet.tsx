"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { KanbanCard, stages } from "@/@types/Kaban"

type EditCardSheetProps = {
  isOpen: boolean
  onClose: () => void
  editingCard: KanbanCard | null
  setEditingCard: React.Dispatch<React.SetStateAction<KanbanCard | null>>
  updateCard: () => void
}

export function EditCardSheet({ isOpen, onClose, editingCard, setEditingCard, updateCard }: EditCardSheetProps) {
  const [date, setDate] = useState<Date | undefined>(editingCard?.endDate ? new Date(editingCard.endDate) : undefined)

  if (!editingCard) return null

  const handleFileChange = (field: keyof KanbanCard) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setEditingCard({ ...editingCard, [field]: file })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto w-[2300px]">
        <SheetHeader className="mb-2">
          <SheetTitle>{editingCard.title}</SheetTitle>
          <SheetDescription>Editar detalhes do processo</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input
              id="title"
              value={editingCard.title}
              onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="description" className="text-right">Descrição</Label>
            <Textarea
              id="description"
              value={editingCard.description}
              onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="stage" className="text-right">Etapa</Label>
            <Select
              value={editingCard.stage.toString()}
              onValueChange={(value) => setEditingCard({ ...editingCard, stage: parseInt(value) })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a etapa" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="startDate" className="text-right">Data de Início</Label>
            <Input
              id="startDate"
              value={editingCard.startDate}
              disabled
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="endDate" className="text-right">Data de Conclusão</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setEditingCard({ ...editingCard, endDate: newDate?.toISOString() || null })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="franchise" className="text-right">Franquia</Label>
            <Select
              value={editingCard.franchise}
              onValueChange={(value) => setEditingCard({ ...editingCard, franchise: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a franquia" />
              </SelectTrigger>
              <SelectContent>
                {/* Placeholder for API data */}
                <SelectItem value="franquia1">Franquia 1</SelectItem>
                <SelectItem value="franquia2">Franquia 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="process" className="text-right">Processo</Label>
            <Select
              value={editingCard.process}
              onValueChange={(value: KanbanCard['process']) => setEditingCard({ ...editingCard, process: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abertura de empresa">Abertura de Empresa</SelectItem>
                <SelectItem value="alteração contratual">Alteração Contratual</SelectItem>
                <SelectItem value="transformação">Transformação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="cnpj" className="text-right">CNPJ</Label>
            <Input
              id="cnpj"
              value={editingCard.cnpj}
              onChange={(e) => setEditingCard({ ...editingCard, cnpj: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="socialContract" className="text-right">Contrato Social</Label>
            <Input
              id="socialContract"
              type="file"
              onChange={handleFileChange('socialContract')}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="cnpjCard" className="text-right">Cartão CNPJ</Label>
            <Input
              id="cnpjCard"
              type="file"
              onChange={handleFileChange('cnpjCard')}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="license" className="text-right">Alvará</Label>
            <Input
              id="license"
              type="file"
              onChange={handleFileChange('license')}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label htmlFor="otherDocuments" className="text-right">Demais Documentos</Label>
            <Input
              id="otherDocuments"
              type="file"
              onChange={handleFileChange('otherDocuments')}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <Label className="text-right">Processos</Label>
            <div className="col-span-3 space-y-2">
              {stages[editingCard.stage].processes.map((process) => (
                <div key={process} className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
                  <Checkbox
                    id={process}
                    checked={editingCard.completedProcesses.includes(process)}
                    onCheckedChange={(checked) => {
                      const updatedProcesses = checked
                        ? [...editingCard.completedProcesses, process]
                        : editingCard.completedProcesses.filter(p => p !== process)
                      setEditingCard({ ...editingCard, completedProcesses: updatedProcesses })
                    }}
                  />
                  <label htmlFor={process} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {process}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button onClick={updateCard}>Atualizar Processo</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}