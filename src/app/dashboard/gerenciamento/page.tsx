'use client'
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusCircle } from "lucide-react";
import TableContabilidades from "./table";
import Title from "../page-title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateContabilidadeForm from "./form";
import RefreshButton from "./refresh";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectDemo } from "./select";
import { useState } from "react";

export default function GerenciamentoAtividades() {
  const [activeTab, setActiveTab] = useState("contabilidades");

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
          <DialogContent>
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

        <Tabs defaultValue="contabilidades" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <div>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contabilidades">Contabilidades</TabsTrigger>
                <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              </TabsList>
            </div>
            {activeTab === "usuarios" && <SelectDemo />}
          </div>
          <TabsContent value="contabilidades">
            <TableContabilidades />
          </TabsContent>
          <TabsContent value="usuarios">
            <h1>Usuarios</h1>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
