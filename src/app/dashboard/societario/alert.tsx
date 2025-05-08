import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface RemoveAlertDialogProps {
    isOpen: boolean;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
  }
  
  export function RemoveAlertDialog({
    isOpen,
    onConfirm,
    onCancel,
  }: RemoveAlertDialogProps) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este processo? Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
            className="bg-red-600"
              onClick={async () => {
                await onConfirm();
                onCancel(); // fecha o diálogo
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  