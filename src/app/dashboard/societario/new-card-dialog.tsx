import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KanbanCard, stages } from "@/@types/Kaban"

type NewCardDialogProps = {
  isOpen: boolean
  onClose: () => void
  newCard: Partial<KanbanCard>
  setNewCard: React.Dispatch<React.SetStateAction<Partial<KanbanCard>>>
  addCard: () => void
}

export function NewCardDialog({ isOpen, onClose, newCard, setNewCard, addCard }: NewCardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Processo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input
              id="title"
              value={newCard.title}
              onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descrição</Label>
            <Textarea
              id="description"
              value={newCard.description}
              onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stage" className="text-right">Etapa</Label>
            <Select
              value={newCard.stage?.toString()}
              onValueChange={(value) => setNewCard({ ...newCard, stage: parseInt(value) })}
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
        </div>
        <DialogFooter>
          <Button onClick={addCard}>Adicionar Processo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}