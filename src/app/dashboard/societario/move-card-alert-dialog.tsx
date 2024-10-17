import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type MoveCardAlertProps = {
  isOpen: boolean
  onClose: () => void
  onMove: () => void
}

export function MoveCardAlert({ isOpen, onClose, onMove}: MoveCardAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mover para próxima etapa?</AlertDialogTitle>
          <AlertDialogDescription>
            Todas as tarefas desta etapa foram concluídas. Deseja mover o processo para a próxima etapa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onMove}>Mover</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}