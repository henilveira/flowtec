"use client";

import { useMemo, useState, useEffect } from "react";
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
  const { tipoProcessos, isLoading: tipoProcessosLoading } = useListTipoProcessos();
  const { etapas, isLoading: etapasLoading } = useListEtapas();
  const { selectedCompany } = useContabilidade();

  const [name, setName] = useState("");
  const [selectedProcessType, setSelectedProcessType] = useState(tipoProcessos[0]?.id || "");
  const [selectedEtapa, setSelectedEtapa] = useState(etapas[0]?.id || "");

  // Memorize tipoProcessos e etapas para evitar recalcular ou re-fetch
  const memoizedTipoProcessos = useMemo(() => tipoProcessos, [tipoProcessos]);
  const memoizedEtapas = useMemo(() => etapas, [etapas]);

  // Estado para controlar se os dados estão carregados
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (memoizedTipoProcessos.length > 0 && memoizedEtapas.length > 0) {
      setIsDataLoaded(true); // Marca os dados como carregados
    }
  }, [memoizedTipoProcessos, memoizedEtapas]);

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Supondo que a função de criação de processo seja chamada aqui
      // await novoRegistro(selectedCompany, name, selectedProcessType);
      toast("Processo criado com sucesso!", {
        description: "Envie o link de formulário para seu cliente preencher os dados!",
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
            Preencha os campos abaixo para iniciar o processo de requisição e criar um card
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRequest}>
          {tipoProcessosLoading || etapasLoading ? (
            <div>Carregando dados...</div>
          ) : !isDataLoaded ? (
            <div>Nenhum processo ou etapa disponível</div>
          ) : (
            <>
              <Tabs
                defaultValue={memoizedTipoProcessos[0]?.id}
                onValueChange={setSelectedProcessType}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {memoizedTipoProcessos.map((processo) => (
                    <TabsTrigger key={processo.id} value={processo.id}>
                      {processo.descricao}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {memoizedTipoProcessos.map((processo) => (
                  <TabsContent key={processo.id} value={processo.id}>
                    <div className="flex justify-center items-start gap-2">
                      <Select
                        onValueChange={setSelectedEtapa} 
                        value={selectedEtapa} 
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Etapa..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {memoizedEtapas.map((etapa) => (
                              <SelectItem key={etapa.id} value={etapa.id}>
                                {etapa.nome}
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
                    placeholder="Empresa de Pedro"
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
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
