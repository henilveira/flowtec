"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import {
  Clock,
  CalendarIcon,
  Copy,
  FileText,
  Loader2,
  TrashIcon,
  Trash2Icon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useProcessosByEtapas,
  useSocietarioActions,
} from "@/hooks/useSocietario";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { RemoveAlertDialog } from "./alert";
import DatePicker from "@/components/date-picker";

const TiposTributacao = ["simples", "lucro", "real"];

interface Tarefa {
  id: string;
  tarefa: {
    descricao: string;
    obrigatoria: boolean;
  };
  nao_aplicavel: boolean;
  concluida: boolean;
  sequencia: number;
  expire_at?: Date;
  tipo_tributacao?: string;
  etapa: {
    id: string;
    nome: string;
  };
}

interface Etapa {
  id: string;
  nome: string;
  ordem: number;
}

interface Processo {
  id: string;
  nome: string;
  tipo_processo: {
    descricao: string;
  };
  contabilidade: {
    nome: string;
    cnpj: string;
  };
  etapa?: {
    id: string;
    nome: string;
  };
  tarefas: Tarefa[];
  expire_at: string;
  created_at: string;
}

interface EditSheetProps {
  processo: Processo;
  etapas: Etapa[];
  tarefas: Tarefa[];
  viewFormLink: string;
  onSave: (updatedProcesso: Processo) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const calcularDiasPassados = (startDate: string): number => {
  const dataInicio = new Date(startDate);
  const dataAtual = new Date();
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime();
  return Math.floor(diferencaEmMs / (1000 * 3600 * 24));
};

// Função para formatar o tipo de tributação com a primeira letra maiúscula
const formatarTipoTributacao = (tipo: string): string => {
  if (tipo === "simples") return "Simples Nacional";
  if (tipo === "lucro") return "Lucro Presumido";
  if (tipo === "real") return "Lucro Real";
  else {
    return "";
  }
};

export default function EditSheet({
  processo,
  etapas,
  tarefas,
  onSave,
  onCancel,
  viewFormLink,
  isLoading,
}: EditSheetProps) {
  // Corrigida a inicialização do estado para garantir a estrutura correta
  const [tarefasAtualizadas, setTarefasAtualizadas] = useState<Tarefa[]>(
    tarefas
      .map((t) => ({
        ...t,
        // Garantir que expire_at seja um objeto Date se existir
        expire_at: t.expire_at ? new Date(t.expire_at) : undefined,
        concluida: t.concluida,
        nao_aplicavel: t.nao_aplicavel,
      }))
      .sort((a, b) => a.sequencia - b.sequencia)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [dateInputs, setDateInputs] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSimplesNacional, setIsSimplesNacional] = useState(false);

  // Encontrar o tipo de tributação inicial a partir das tarefas
  const getTipoTributacaoInicial = (): string => {
    const tarefaComTipo = tarefas.find((t) => t.tipo_tributacao);
    return tarefaComTipo?.tipo_tributacao || "";
  };

  // Corrigido: inicializa com um valor padrão se não encontrar nas tarefas
  const [tributacao, setTributacao] = useState<string>(() => {
    const tipoInicial = getTipoTributacaoInicial();
    return tipoInicial || "Selecionar..."; // Valor padrão se não houver tipo definido
  });

  // Atualizar o estado quando as tarefas mudarem
  // Efeito para inicializar o status do "Simples solicitado" com base no tipo de tributação
  useEffect(() => {
    const tipoInicial = getTipoTributacaoInicial();
    if (tipoInicial) {
      setTributacao(tipoInicial);

      // Atualiza o status do "Simples solicitado" na inicialização com base no tipo
      setTarefasAtualizadas((prevTarefas) =>
        prevTarefas.map((t) => {
          if (t.tarefa.descricao === "Simples solicitado") {
            return {
              ...t,
              nao_aplicavel: tipoInicial !== "simples",
              // Se estava concluída e o tipo mudou, mantém a conclusão
              // Caso contrário, deixa como estava
              concluida: tipoInicial !== "simples" ? false : t.concluida,
            };
          }
          return t;
        })
      );
    }
  }, [processo.id]);

  const { mutate } = useProcessosByEtapas();
  const { updateProcesso, remove } = useSocietarioActions();
  const linkToForm = `https://www.flowtec.dev/formulario/visualizar?id=${viewFormLink}`;
  const formLink = `https://www.flowtec.dev/formulario/abertura?id=${processo.id}`;

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(formLink).then(() => {
      toast.success("Link copiado para a área de transferência!", {
        description: "Envie para o seu cliente preencher",
      });
    });
  };

  const handleTributacaoChange = (novoTipo: string) => {
    setTributacao(novoTipo);

    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) => {
        if (t.tarefa.descricao === "Simples solicitado") {
          return {
            ...t,
            tipo_tributacao: novoTipo,
            nao_aplicavel: novoTipo !== "simples",
            concluida: false,
          };
        }

        // Para qualquer outra tarefa da etapa 5, só atualiza o tipo de tributação
        if (t.etapa && etapas.find((e) => e.id === t.etapa.id)?.ordem === 5) {
          return {
            ...t,
            tipo_tributacao: novoTipo,
          };
        }
        return t;
      })
    );
  };

  const handleTaskToggle = (id: string, concluida: boolean) => {
    // Group tasks by stage, ensuring task.etapa and task.etapa.id are defined
    const stageTaskMap = tarefasAtualizadas.reduce((acc, task) => {
      if (task.etapa && task.etapa.id) {
        if (!acc[task.etapa.id]) {
          acc[task.etapa.id] = [];
        }
        acc[task.etapa.id].push(task);
      }
      return acc;
    }, {} as { [stageId: string]: Tarefa[] });

    // Sort stages by ordem, including only stages with tasks
    const sortedStages = etapas
      .filter((stage) => stageTaskMap[stage.id] !== undefined)
      .sort((a, b) => a.ordem - b.ordem);

    // Sort tasks within each stage by sequencia
    sortedStages.forEach((stage) => {
      stageTaskMap[stage.id] = stageTaskMap[stage.id].sort(
        (a, b) => a.sequencia - b.sequencia
      );
    });

    // Create a flat list of tasks in the sorted order
    const sortedTasks = sortedStages
      .map((stage) => stageTaskMap[stage.id])
      .flat();

    // Find the current task and its index
    const currentTask = sortedTasks.find((t) => t.id === id);
    if (!currentTask) return; // Task not found

    if (!currentTask.etapa || !currentTask.etapa.id) {
      toast("Tarefa sem etapa definida.");
      return;
    }

    const taskIndex = sortedTasks.indexOf(currentTask);

    if (concluida) {
      // Check if all previous tasks are either completed or optional and dismissed
      for (let i = 0; i < taskIndex; i++) {
        const prevTask = sortedTasks[i];
        const isPrevTaskCompletedOrDismissed =
          prevTask.concluida ||
          (!prevTask.tarefa.obrigatoria && prevTask.nao_aplicavel);

        if (!isPrevTaskCompletedOrDismissed) {
          toast(
            "Você precisa concluir ou dispensar as tarefas anteriores primeiro."
          );
          return;
        }
      }
    } else {
      // Existing logic for unchecking remains the same
      const stagesAfterIndex = sortedStages.findIndex(
        (s) => s.id === currentTask.etapa.id
      );
      const stagesAfter = sortedStages.slice(stagesAfterIndex + 1);
      const tasksAfterStage = stagesAfter.flatMap(
        (stage) => stageTaskMap[stage.id] ?? []
      );
      if (tasksAfterStage.some((t) => t.concluida)) {
        toast(
          "Você não pode desmarcar esta tarefa enquanto houver tarefas concluídas em etapas posteriores."
        );
        return;
      }
      const tasksInStage = stageTaskMap[currentTask.etapa.id];
      if (!tasksInStage) {
        toast("Etapa da tarefa não encontrada.");
        return;
      }
      const taskStageIndex = tasksInStage.indexOf(currentTask);
      if (
        taskStageIndex !== tasksInStage.length - 1 &&
        tasksInStage.slice(taskStageIndex + 1).some((t) => t.concluida)
      ) {
        toast(
          "Você não pode desmarcar esta tarefa enquanto houver tarefas concluídas posteriores na mesma etapa."
        );
        return;
      }
    }

    // Update task status and handle mutual exclusivity
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            concluida,
            // Não alteramos nao_aplicavel aqui
          };
        }
        return t;
      })
    );
  };

  const handleDispensadoToggle = (id: string, dispensado: boolean) => {
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) =>
        t.id === id
          ? {
              ...t,
              concluida: false, // Força concluida para false
              nao_aplicavel: dispensado, // Usa o valor do checkbox
            }
          : t
      )
    );
  };

  const handleDateChange = (tarefaId: string, dateString: string) => {
    // Atualiza o estado de dateInputs com a nova data
    setDateInputs((prev) => ({
      ...prev,
      [tarefaId]: dateString,
    }));

    // Atualiza o estado das tarefas com a nova data
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) => {
        if (t.id === tarefaId) {
          return {
            ...t,
            expire_at: dateString ? new Date(dateString) : undefined,
          };
        }
        return t;
      })
    );
  };

  const getCurrentTributacao = () => {
    const etapa5Tarefas = tarefasAtualizadas.filter(
      (t) => etapas.find((e) => e.id === t.etapa.id)?.ordem === 5
    );
    return etapa5Tarefas[0]?.tipo_tributacao || "Selecionar...";
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Aplica o tipo de tributação atual para todas as tarefas em etapa 5
      const tarefasComTipo = tarefasAtualizadas.map((t) => {
        if (t.etapa && etapas.find((e) => e.id === t.etapa.id)?.ordem === 5) {
          return {
            ...t,
            tipo_tributacao: tributacao,
          };
        }
        return t;
      });

      // Prepara payload para API - inclui TODAS as tarefas com tipo de tributação modificado
      // Modificado para incluir tipo de tributação mesmo para tarefas não concluídas na etapa 5
      const tarefasAlteradas = tarefasComTipo
        .filter((t) => {
          // Inclui tarefas concluídas ou dispensadas
          if (t.concluida || t.nao_aplicavel) return true;

          // Inclui também tarefas da etapa 5, para atualizar o tipo de tributação
          if (t.etapa && etapas.find((e) => e.id === t.etapa.id)?.ordem === 5)
            return true;

          return false;
        })
        .map((t) => {
          const payload: any = {
            id: t.id,
            concluida: t.concluida ? "True" : "False",
            nao_aplicavel: t.nao_aplicavel ? "True" : "False",
          };

          // Adiciona tipo de tributação para tarefas da etapa 5
          if (t.etapa && etapas.find((e) => e.id === t.etapa.id)?.ordem === 5) {
            payload.tipo_tributacao = tributacao;
          } else if (t.tipo_tributacao) {
            // Mantém o tipo de tributação atual para outras tarefas, se existir
            payload.tipo_tributacao = t.tipo_tributacao;
          }

          // Adiciona expire_at se existir
          if (t.expire_at) {
            payload.expire_at = format(t.expire_at, "yyyy-MM-dd");
          }

          return payload;
        });

      // Lógica de progressão de etapas com a nova regra de pular etapa
      let novaEtapaId = processo.etapa?.id || "";
      const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

      // Verifica se o processo é de um dos tipos que devem pular a etapa de viabilidade
      const deveSkipViabilidade =
        processo.tipo_processo.descricao === "Alteração contratual com regin" ||
        processo.tipo_processo.descricao ===
          "Alteração contratual sem regin/baixa";

      if (processo.etapa) {
        const tarefasDaEtapa = tarefasAtualizadas.filter(
          (t) => t.etapa.id === processo.etapa?.id
        );

        const etapaCompleta = tarefasDaEtapa.every(
          (t) => t.concluida || t.nao_aplicavel
        );

        if (etapaCompleta) {
          const indexEtapaAtual = etapasOrdenadas.findIndex(
            (e) => e.id === processo.etapa?.id
          );

          if (
            indexEtapaAtual !== -1 &&
            indexEtapaAtual + 1 < etapasOrdenadas.length
          ) {
            // Verifica se está saindo da etapa de proposta/formulário e se deve pular viabilidade
            const etapaAtual = etapasOrdenadas[indexEtapaAtual];
            const isEtapaPropostaFormulario =
              etapaAtual.nome.toLowerCase().includes("proposta") ||
              etapaAtual.nome.toLowerCase().includes("formulário");

            if (deveSkipViabilidade && isEtapaPropostaFormulario) {
              // Encontra a etapa de viabilidade
              const etapaViabilidade = etapasOrdenadas.find((e) =>
                e.nome.toLowerCase().includes("viabilidade")
              );

              // Encontra a etapa de registro (que vem após viabilidade)
              const indexEtapaViabilidade = etapaViabilidade
                ? etapasOrdenadas.findIndex((e) => e.id === etapaViabilidade.id)
                : -1;

              if (
                indexEtapaViabilidade !== -1 &&
                indexEtapaViabilidade + 1 < etapasOrdenadas.length
              ) {
                // Pular para a etapa após a viabilidade (registro)
                novaEtapaId = etapasOrdenadas[indexEtapaViabilidade + 1].id;

                // Marca todas as tarefas da etapa de viabilidade como concluídas
                const tarefasViabilidade = tarefasAtualizadas.filter(
                  (t) => t.etapa.id === etapaViabilidade?.id
                );

                // Adiciona as tarefas de viabilidade como concluídas ao payload
                tarefasViabilidade.forEach((tarefa) => {
                  tarefasAlteradas.push({
                    id: tarefa.id,
                    concluida: "True",
                    nao_aplicavel: "False",
                  });
                });
              } else {
                // Caso não encontre a etapa de viabilidade ou registro, segue fluxo normal
                novaEtapaId = etapasOrdenadas[indexEtapaAtual + 1].id;
              }
            } else {
              // Fluxo normal - avança para a próxima etapa
              novaEtapaId = etapasOrdenadas[indexEtapaAtual + 1].id;
            }
          }
        }
      }

      // Atualiza o processo com os dados modificados
      await updateProcesso({
        processo_id: processo.id,
        etapa_id: novaEtapaId,
        tarefas: tarefasAlteradas,
      });

      // Atualiza o estado local com as mudanças
      const updatedProcesso = {
        ...processo,
        tarefas: tarefasComTipo,
        etapa: etapas.find((e) => e.id === novaEtapaId) || processo.etapa,
      };

      toast.success("Alterações salvas com sucesso!");
      onSave(updatedProcesso);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  // executa a exclusão de fato
  const confirmDelete = async () => {
    try {
      await remove(processo.id);
      mutate();
      toast.success("Processo excluído com sucesso!");
      onCancel?.(); // fecha o sheet, se quiser
    } catch (err) {
      toast.error("Erro ao excluir processo");
    }
  };

  return (
    <Sheet open onOpenChange={() => onCancel?.()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full overflow-y-auto"
      >
        <div className="flex-grow">
          <div className="flex justify-start items-center mb-6">
            <div className="flex items-start justify-between w-full gap-2">
              <div className="flex-col flex ">
                <h1 className="text-2xl font-bold">{processo.nome}</h1>
                <p className="italic text-muted-foreground text-sm">
                  {processo.contabilidade.nome}
                </p>
              </div>
              <Button
                variant={"destructive"}
                className="px-3"
                onClick={() => handleDeleteClick()}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Dias corridos
                </Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {calcularDiasPassados(processo.created_at)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Tipo de processo
                </Label>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="">{processo.tipo_processo.descricao}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de início
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de conclusão
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.expire_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {etapas.map((etapa) => (
                  <AccordionItem key={etapa.id} value={etapa.id}>
                    <AccordionTrigger>{etapa.nome}</AccordionTrigger>
                    <AccordionContent>
                      {etapa.ordem == 5 && (
                        <div className="space-y-2 mx-1 mb-4">
                          <Label>Tipo de tributação</Label>
                          <Select
                            value={getCurrentTributacao()}
                            onValueChange={handleTributacaoChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {TiposTributacao.map((tipo) => (
                                  <SelectItem key={tipo} value={tipo}>
                                    {formatarTipoTributacao(tipo)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2">
                        {tarefasAtualizadas
                          .filter(
                            (t) =>
                              t.etapa.id === etapa.id &&
                              !(
                                t.tarefa.descricao === "Simples solicitado" &&
                                tributacao !== "simples"
                              )
                          )
                          .map((tarefa) => (
                            <div
                              key={tarefa.id}
                              className="flex items-center justify-between"
                            >
                              {/* Concluído */}
                              <div className="flex items-center space-x-2 flex-1">
                                <Checkbox
                                  id={tarefa.id}
                                  checked={tarefa.concluida}
                                  disabled={tarefa.nao_aplicavel}
                                  onCheckedChange={(checked) =>
                                    handleTaskToggle(
                                      tarefa.id,
                                      checked === true
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={tarefa.id}
                                  className={`text-sm leading-none ${
                                    tarefa.concluida
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {tarefa.tarefa.descricao}
                                </Label>
                              </div>

                              {/* Checkbox N/A para Simples solicitado quando tributação simples */}
                              {tarefa.tarefa.descricao ===
                                "Simples solicitado" &&
                              tributacao === "simples" ? (
                                <div className="flex items-center space-x-2 ml-4">
                                  <Checkbox
                                    className="hidden"
                                    id={`dispensado-${tarefa.id}`}
                                    checked={tarefa.nao_aplicavel}
                                    onCheckedChange={(checked) =>
                                      handleDispensadoToggle(
                                        tarefa.id,
                                        checked === true
                                      )
                                    }
                                  />
                                </div>
                              ) : (
                                /* Dispensado + Data para outras não obrigatórias */
                                !tarefa.tarefa.obrigatoria && (
                                  <div className="flex items-center space-x-4 ml-4">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`dispensado-${tarefa.id}`}
                                        checked={tarefa.nao_aplicavel}
                                        onCheckedChange={(checked) =>
                                          handleDispensadoToggle(
                                            tarefa.id,
                                            checked === true
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`dispensado-${tarefa.id}`}
                                        className="text-sm text-muted-foreground"
                                      >
                                        N/A
                                      </Label>
                                    </div>
                                    {/* Input de data */}
                                    <DatePicker
                                      id={`data-${tarefa.id}`}
                                      placeholder="Data de expiração"
                                      className="w-[160px]"
                                      value={
                                        tarefa.expire_at
                                          ? format(
                                              tarefa.expire_at,
                                              "yyyy-MM-dd"
                                            )
                                          : ""
                                      }
                                      onChange={(date) =>
                                        handleDateChange(tarefa.id, date)
                                      }
                                      onBlur={() => {}} // Pode adicionar validação adicional aqui se necessário
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="space-y-2 my-6">
            <div className="space-x-2">
              <Label className="text-sm text-muted-foreground">
                Link para formulário
              </Label>
              <Link href={linkToForm} target="_blank" rel="noopener noreferrer">
                <span className="text-sm underline text-blue-600">
                  Visualizar
                </span>
              </Link>
            </div>
            <div className="flex space-x-2">
              <Input readOnly value={formLink} className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 flex justify-end sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="flowtec"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
      <RemoveAlertDialog
        isOpen={isDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDialogOpen(false)}
      />{" "}
    </Sheet>
  );
}
