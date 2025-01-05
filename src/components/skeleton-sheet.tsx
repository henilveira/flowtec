import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface SkeletonSheetProps {
  open?: boolean;
  onClose?: () => void;
}

export function SkeletonSheet({ open = true, onClose }: SkeletonSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[385px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle>
            <Skeleton className="h-8 w-24" />
          </SheetTitle>
          <Skeleton className="h-6 w-48" />
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Process Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          {/* Collapsible Sections */}
          {[
            "Proposta/Formulário",
            "Viabilidade",
            "Registro",
            "Alvarás",
            "Simples/NF",
            "Concluído",
          ].map((section) => (
            <div key={section} className="py-4 border-b">
              <button className="w-full flex items-center justify-between">
                <span className=" font-medium">{section}</span>
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="hidden pt-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}

          {/* Form Link */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" disabled>
              Cancelar
            </Button>
            <Button disabled>Salvar alterações</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
