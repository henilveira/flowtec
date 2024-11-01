"use client";
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
import { useSocietario } from "@/hooks/useSocietario";
import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SelectContabilidade, useContabilidade } from "./select";

export function Requisicao() {
    const { novoRegistro } = useSocietario()
    const { selectedCompany } = useContabilidade();
    const [name, setName] = useState('')

    const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            await novoRegistro(selectedCompany, name);
            toast("Processo criado com sucesso!", {
                description:
                  "Envie o link de formulário para seu cliente preencher os dados!",
              });
        } catch (error) {
            // Tratar erro aqui
            console.error(error);
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
            <div className="flex justify-center items-start gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Etapa..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="proposta">
                      Proposta / Formulário
                    </SelectItem>
                    <SelectItem value="viabilidade">Viabilidade</SelectItem>
                    <SelectItem value="alvaras">Alvarás</SelectItem>
                    <SelectItem value="simples">Simples / NF</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Processo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="abertura">
                      Abertura de Empresa
                    </SelectItem>
                    <SelectItem value="alteracao">
                      Alteração Contratual
                    </SelectItem>
                    <SelectItem value="transformacao">Transformação</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}
            </div>
            <div className="flex justify-center items-start gap-2">
              <div className="flex flex-1 gap-2 flex-col">
                <Label htmlFor="name" className="text-left">
                  Link para formulário
                </Label>
                <div className="flex items-center justify-center gap-2">
                  <Input
                    id="link"
                    defaultValue="https://flowtec.com.br/form/nfg2356bfde54/563g346jer"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                    onClick={(event) => {
                      event.preventDefault(); // Previne o fechamento do diálogo
                      toast("Link para formulário copiado!", {
                        description:
                          "Envie o link de formulário para seu cliente preencher os dados!",
                      });
                    }}
                  >
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant={"flowtec"}>
              Abrir requisição
            </Button>
          </DialogClose>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
