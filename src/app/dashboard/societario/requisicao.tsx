"use client";
import { Loader2 } from "lucide-react";

import { useMemo, useCallback, useState, useEffect, memo } from "react";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  useProcessosByEtapas,
  useSocietarioActions,
} from "@/hooks/useSocietario";
import { SelectContabilidade, useContabilidade } from "./select-contabilidade";

export const Requisicao = memo(function Requisicao() {
  const { novoRegistro, isLoading, processId, errorRegistro, errorUpdate } =
    useSocietarioActions();
  const { mutate } = useProcessosByEtapas();
  const { selectedCompany } = useContabilidade();
  const { tipoProcessos } = useListTipoProcessos();

  const [showFormLink, setShowFormLink] = useState(false);
  const [selectedTipoProcesso, setSelectedTipoProcesso] = useState("");
  const [nomeCard, setNomeCard] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormLink, setCurrentFormLink] = useState<string>("");

  const resetForm = useCallback(() => {
    setShowFormLink(false);
    setSelectedTipoProcesso("");
    setNomeCard("");
    setCurrentFormLink("");
  }, []);

  useEffect(() => {
    if (processId) {
      setCurrentFormLink(
        `https://www.flowtec.dev/formulario/abertura?id=${processId}`
      );
    }
  }, [processId]);

  const copyToClipboard = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard.writeText(currentFormLink).then(() => {
        toast.success("Link copiado para a área de transferência!", {
          description: "Este link ficará salvo no card, não se preocupe.",
        });
      });
    },
    [currentFormLink]
  );

  const handleRequest = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await novoRegistro(
          nomeCard,
          selectedCompany,
          selectedTipoProcesso,
          "d2ddd5ad-a82b-4335-9d6a-1cc797563930"
          // "e798715d-460e-410a-820a-8c4b6ce4ab4e"
        );
        setShowFormLink(true);
        toast.success("Processo criado com sucesso!", {
          description: "Espere alguns segundos para carregar seu novo card...",
        });
        setTimeout(() => {
          mutate();
        }, 2000);
      } catch (errorRegistro) {
        toast.error("Erro ao criar processo", {
          description: "Houve algum erro ao criar seu novo processo.",
        });
      }
    },
    [nomeCard, selectedCompany, selectedTipoProcesso, novoRegistro, mutate]
  );

  const handleValueChange = useCallback((value: string) => {
    setSelectedTipoProcesso(value);
  }, []);

  const getDescricaoSimplificada = useCallback((descricao: string) => {
    if (descricao === "Abertura de empresa") return "Abertura";
    if (descricao === "Alteração contratual com regin") return "Alteração";
    if (descricao === "Alteração contratual sem regin/baixa") return "Baixa";
    return descricao;
  }, []);

  const tabsTriggers = useMemo(
    () =>
      tipoProcessos.map((processo) => (
        <TabsTrigger key={processo.id} value={processo.id} className="w-full">
          {getDescricaoSimplificada(processo.descricao)}
        </TabsTrigger>
      )),
    [tipoProcessos, getDescricaoSimplificada]
  );

  const tabsContents = useMemo(
    () =>
      tipoProcessos.map((processo) => (
        <TabsContent key={processo.id} value={processo.id}>
          <div className="flex justify-center items-start gap-2">
            {processo.descricao === "Alteração contratual com regin" && (
              <div className="items-start flex flex-col gap-2 w-full">
                <Label htmlFor="Contabilidade" className="text-right">
                  Com ou sem regin?
                </Label>
                <Select
                  onValueChange={setSelectedTipoProcesso}
                  value={selectedTipoProcesso}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={tipoProcessos[1].id || ""}>
                        Com Regin
                      </SelectItem>
                      <SelectItem value={tipoProcessos[2].id || ""}>
                        Sem Regin
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>
      )),
    [tipoProcessos, selectedTipoProcesso]
  );

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm]
  );

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNomeCard(e.target.value);
    },
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="flowtec" onClick={openDialog}>
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
          <Tabs
            defaultValue="Abertura de empresa"
            onValueChange={handleValueChange}
            className="w-full"
          >
            <TabsList className="w-full">{tabsTriggers}</TabsList>

            {tabsContents}
          </Tabs>

          <div className="grid gap-4 py-2">
            <div className="w-full md:w-auto flex gap-4">
              {selectedTipoProcesso === "Abertura de empresa" ? (
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Label htmlFor="Contabilidade" className="text-right">
                    Contabilidade associada
                  </Label>
                  <SelectContabilidade />
                </div>
              ) : (
                <div className="w-full">
                  <Label htmlFor="Contabilidade" className="text-right">
                    Contabilidade associada
                  </Label>
                  <SelectContabilidade />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-start gap-2">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Empresa de Pedro"
                value={nomeCard}
                onChange={handleNameChange}
                className="w-full"
              />
            </div>

            {/* Form Link Section */}
            <div
              className={`
                transition-all duration-500 ease-in-out
                ${
                  showFormLink
                    ? "mb-4 opacity-100 h-[50px]"
                    : "h-0 opacity-0 overflow-hidden pointer-events-none"
                }
              `}
            >
              <div className="flex flex-col gap-2">
                <Label className="text-left">Link para formulário</Label>
                <div className="flex gap-2">
                  <Input readOnly value={currentFormLink} className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button onClick={resetForm} variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" variant="flowtec" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Abrindo...
                </>
              ) : (
                "Abrir requisição"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
