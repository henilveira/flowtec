import { Button } from "@/components/ui/button";
import { FilterIcon, PlusCircle, Search } from "lucide-react";
import TableContabilidades from "./table";
import Title from "../page-title";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateContabilidadeForm from "./form";
import RefreshButton from "./refresh";

export default function GerenciamentoAtividades() {
  return (
    <div className=" mx-auto">
      <Title titulo="Gerenciamento">
        <RefreshButton />
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="flowtec">
              <PlusCircle className="mr-2 h-4 w-4" /> Cadastrar contabilidade
            </Button>
          </DialogTrigger>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>Cadastrar contabilidade</DialogTitle>
              <DialogDescription>
                Informe o CNPJ da contabilidade que deseja associar à sua conta.
              </DialogDescription>
            </DialogHeader>
            <CreateContabilidadeForm />
          </DialogContent>
        </Dialog>
      </Title>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between">
          <div className="space-x-3"></div>
        </div>
        <TableContabilidades />
      </div>
    </div>
  );
}
