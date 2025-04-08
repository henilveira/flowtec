"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Clock, CalendarIcon, Copy, FileText, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSocietarioActions } from "@/hooks/useSocietario";
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
  if (!tipo) return "";
  return tipo.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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
  
  // Encontrar o tipo de tributação inicial a partir das tarefas
  const getTipoTributacaoInicial = (): string => {
    const tarefaComTipo = tarefas.find(t => t.tipo_tributacao);
    return tarefaComTipo?.tipo_tributacao || "";
  };
  
  const [tributacao, setTributacao] = useState(getTipoTributacaoInicial());

  // Atualizar o estado quando as tarefas mudarem
  useEffect(() => {
    setTributacao(getTipoTributacaoInicial());
  }, [processo.id]);

  const { updateProcesso } = useSocietarioActions();
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
  const formatDateInput = (input: string) => {
    const numbers = input.replace(/\D/g, "");

    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      if (i === 2 || i === 4) formatted += "-";
      if (i >= 8) break;
      formatted += numbers[i];
    }

    return formatted;
  };

  const handleDateInputChange = (tarefaId: string, value: string) => {
    const formattedValue = formatDateInput(value);

    // Atualiza o input com o valor formatado (DD-MM-AAAA)

    // Tenta converter apenas quando o formato estiver completo (DD-MM-AAAA)
    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split("-").map(Number);

      // Cria a data (lembre-se que o mês no construtor Date é 0-indexed)
      const newDate = new Date(year, month - 1, day);

      // Verifica se a data é válida
      if (!isNaN(newDate.getTime())) {
        setTarefasAtualizadas((prevTarefas) =>
          prevTarefas.map((t) =>
            t.id === tarefaId
              ? {
                  ...t,
                  expire_at: newDate,
                }
              : t
          )
        );
      }
    }
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

  const handleDateChange = (tarefaId: string, newDate: Date | undefined) => {
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) =>
        t.id === tarefaId
          ? {
              ...t,
              expire_at: newDate,
            }
          : t
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Atualiza o tipo de tributação em todas as tarefas que precisam dele
      // (manter a lógica de atribuir o tipo de tributação às tarefas)
      const tarefasComTipo = tarefasAtualizadas.map(t => {
        if (t.etapa && etapas.find(e => e.id === t.etapa.id)?.ordem === 5) {
          return {
            ...t,
            tipo_tributacao: tributacao
          };
        }
        return t;
      });
      
      const tarefasAlteradas = tarefasComTipo
        .filter((t) => t.concluida || t.nao_aplicavel)
        .map((t) => {
          const payload: any = {
            id: t.id,
            concluida: t.concluida ? "True" : "False",
            nao_aplicavel: t.nao_aplicavel ? "True" : "False",
            tipo_tributacao: t.tipo_tributacao, // Usa o tipo de tributação da tarefa
          };

          // Adiciona expire_at se existir
          if (t.expire_at) {
            payload.expire_at = format(t.expire_at, "yyyy-MM-dd");
          }

          return payload;
        });

      // Lógica de progressão de etapas (mantida igual)
      let novaEtapaId = processo.etapa?.id || "";
      const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

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
            novaEtapaId = etapasOrdenadas[indexEtapaAtual + 1].id;
          }
        }
      }

      // Atualiza com os dados da data
      await updateProcesso({
        processo_id: processo.id,
        etapa_id: novaEtapaId,
        tarefas: tarefasAlteradas,
      });

      // Atualiza o estado local com as datas
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

  return (
    <Sheet open onOpenChange={() => onCancel?.()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full overflow-y-auto"
      >
        <div className="flex-grow">
          <div className="flex justify-start items-center mb-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <div>
                <h1 className="text-2xl font-bold">{processo.nome}</h1>
                <p className="italic text-muted-foreground text-sm">
                  {processo.contabilidade.nome}
                </p>
              </div>
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
                      {etapa.ordem === 5 && (
                        <div className="mb-4">
                          <Label 
                            htmlFor={`tributacao-${etapa.id}`} 
                            className="text-sm font-medium mb-2 block"
                          >
                            Tipo de Tributação
                          </Label>
                          <Select 
                            value={tributacao} 
                            onValueChange={setTributacao}
                          >
                            <SelectTrigger 
                              id={`tributacao-${etapa.id}`} 
                              className="w-full h-10 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <SelectValue placeholder="Selecione o tipo de tributação">
                                {tributacao ? formatarTipoTributacao(tributacao) : "Selecione o tipo de tributação"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="min-w-[220px]">
                              <SelectGroup>
                                <SelectLabel>Tipos de Tributação</SelectLabel>
                                {TiposTributacao.map((tipo) => (
                                  <SelectItem key={tipo} value={tipo} className="cursor-pointer">
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
                          .filter((tarefa) => tarefa.etapa.id === etapa.id)
                          .map((tarefa) => (
                            <div
                              className="flex items-center justify-between"
                              key={tarefa.id}
                            >
                              {/* Checkbox Concluído */}
                              <div className="flex items-center space-x-2 flex-1">
                                <Checkbox
                                  id={tarefa.id}
                                  checked={tarefa.concluida}
                                  disabled={tarefa.nao_aplicavel}
                                  onCheckedChange={(checked) => {
                                    handleTaskToggle(
                                      tarefa.id,
                                      checked === true
                                    );
                                  }}
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

                              {/* Checkbox Dispensado */}
                              {!tarefa.tarefa.obrigatoria && (
                                <div className="flex items-center space-x-4 ml-4">
                                  {/* Checkbox */}
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`dispensado-${tarefa.id}`}
                                      checked={tarefa.nao_aplicavel}
                                      onCheckedChange={(checked) => {
                                        handleDispensadoToggle(
                                          tarefa.id,
                                          checked === true
                                        );
                                      }}
                                    />
                                    <Label
                                      htmlFor={`dispensado-${tarefa.id}`}
                                      className="text-sm text-muted-foreground"
                                    >
                                      N/A
                                    </Label>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Label
                                      htmlFor={`data-${tarefa.id}`}
                                      className="text-sm text-muted-foreground"
                                    ></Label>
                                    <Input
                                      id={`data-${tarefa.id}`}
                                      type="text"
                                      placeholder="Data de expiração"
                                      className="w-[160px]"
                                      value={
                                        dateInputs[tarefa.id] ||
                                        (tarefa.expire_at
                                          ? format(
                                              tarefa.expire_at,
                                              "dd-MM-yyyy"
                                            )
                                          : "")
                                      }
                                      onChange={(e) => {
                                        const rawValue = e.target.value;
                                        const formattedValue =
                                          formatDateInput(rawValue);

                                        // Atualiza o estado temporário
                                        setDateInputs((prev) => ({
                                          ...prev,
                                          [tarefa.id]: formattedValue,
                                        }));

                                        // Tenta converter para Date apenas quando completo
                                        if (formattedValue.length === 10) {
                                          const [day, month, year] =
                                            formattedValue
                                              .split("-")
                                              .map(Number);
                                          const newDate = new Date(
                                            year,
                                            month - 1,
                                            day
                                          );

                                          if (!isNaN(newDate.getTime())) {
                                            handleDateChange(
                                              tarefa.id,
                                              newDate
                                            );
                                          }
                                        } else {
                                          handleDateChange(
                                            tarefa.id,
                                            undefined
                                          );
                                        }
                                      }}
                                      onBlur={() => {
                                        // Limpa o estado temporário ao sair do campo
                                        setDateInputs((prev) => ({
                                          ...prev,
                                          [tarefa.id]: "",
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
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
    </Sheet>
  );
}