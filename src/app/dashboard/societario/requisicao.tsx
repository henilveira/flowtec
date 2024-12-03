"use client";

import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useListEtapas,
  useListTipoProcessos,
  useSocietarioActions,
} from "@/hooks/useSocietario";
import { SelectContabilidade, useContabilidade } from "./select";

export function Requisicao() {
  const { novoRegistro } = useSocietarioActions();
  const { tipoProcessos, isLoading } = useListTipoProcessos();
  const { etapas } = useListEtapas();
  const { selectedCompany } = useContabilidade();
  const [name, setName] = useState("");
  const [selectedProcessType, setSelectedProcessType] = useState(
    tipoProcessos[0]?.id || ""
  );
  const [selectedEtapa, setSelectedEtapa] = useState(
    etapas[0]?.id || ""
  );
  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // await novoRegistro(selectedCompany, name, selectedProcessType);
      toast("Processo criado com sucesso!", {
        description:
          "Envie o link de formulário para seu cliente preencher os dados!",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar processo", {
        description: "Por favor, tente novamente mais tarde.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="flowtec">
          <Plus className="mr-2 h-5 w-5" /> Abrir requisição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Abrir requisição</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para iniciar o processo de requisição e
            criar um card
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRequest}>
          {isLoading ? (
            <div>Carregando processos...</div>
          ) : tipoProcessos.length === 0 ? (
            <div>Nenhum processo disponível</div>
          ) : (
            <>
              <Tabs
                defaultValue={tipoProcessos[0].id}
                onValueChange={setSelectedProcessType}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {tipoProcessos.map((processo) => (
                    <TabsTrigger key={processo.id} value={processo.id}>
                      {processo.descricao}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.values(tipoProcessos).map((processo) => (
                  <TabsContent key={processo.id} value={processo.id}>
                    <div className="flex justify-center items-start gap-2">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Etapa..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(etapas).map((etapa) => (
                              <SelectItem key={etapa.id} value={etapa.id}>
                                {etapa.nome} {/* Exibe o nome da etapa */}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="grid gap-4 py-4">
                <div className="flex flex-col justify-center items-start gap-2">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    placeholder="Empresa de pedro"
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                {/* Rest of your existing code */}
              </div>
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="flowtec">
                Abrir requisição
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
