"use client";
import {
  UpdateProcessoRequest,
  UpdateTarefaRequest,
} from "@/@types/Societario";
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

interface Tarefa {
  id: string;
  tarefa: {
    descricao: string;
  };
  concluida: boolean;
  sequencia: number;
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

export default function EditSheet({
  processo,
  etapas,
  tarefas,
  onSave,
  onCancel,
  isLoading,
}: EditSheetProps) {
  const [tarefasAtualizadas, setTarefasAtualizadas] = useState<Tarefa[]>(
    tarefas.sort((a, b) => a.sequencia - b.sequencia),
  );
  const [isSaving, setIsSaving] = useState(false);

  const { updateProcesso } = useSocietarioActions();
  const formLink = `http://localhost:3000/formulario/abertura?id=${processo.id}`;

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(formLink).then(() => {
      toast.success("Link copiado para a área de transferência!", {
        description: "Envie para o seu cliente preencher",
      });
    });
  };

  const handleTaskToggle = (id: string, concluida: boolean) => {
    // Group tasks by stage, ensuring task.etapa and task.etapa.id are defined
    const stageTaskMap = tarefasAtualizadas.reduce(
      (acc, task) => {
        if (task.etapa && task.etapa.id) {
          if (!acc[task.etapa.id]) {
            acc[task.etapa.id] = [];
          }
          acc[task.etapa.id].push(task);
        }
        return acc;
      },
      {} as { [stageId: string]: Tarefa[] },
    );

    // Sort stages by ordem, including only stages with tasks
    const sortedStages = etapas
      .filter((stage) => stageTaskMap[stage.id] !== undefined)
      .sort((a, b) => a.ordem - b.ordem);

    // Sort tasks within each stage by sequencia
    sortedStages.forEach((stage) => {
      stageTaskMap[stage.id] = stageTaskMap[stage.id].sort(
        (a, b) => a.sequencia - b.sequencia,
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
      // Check if all previous tasks are checked
      for (let i = 0; i < taskIndex; i++) {
        if (!sortedTasks[i].concluida) {
          toast("Você precisa concluir as tarefas anteriores primeiro.");
          return;
        }
      }
    } else {
      // Uncheck only if it's the last checked task in its stage and no tasks in later stages are checked
      // Find all tasks in stages after the current stage
      const stagesAfterIndex = sortedStages.findIndex(
        (s) => s.id === currentTask.etapa.id,
      );
      const stagesAfter = sortedStages.slice(stagesAfterIndex + 1);
      const tasksAfterStage = stagesAfter.flatMap(
        (stage) => stageTaskMap[stage.id] ?? [],
      );
      if (tasksAfterStage.some((t) => t.concluida)) {
        toast(
          "Você não pode desmarcar esta tarefa enquanto houver tarefas concluídas em etapas posteriores.",
        );
        return;
      }
      // Within the same stage, ensure no tasks after this one are checked
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
          "Você não pode desmarcar esta tarefa enquanto houver tarefas concluídas posteriores na mesma etapa.",
        );
        return;
      }
    }

    // Update the task status
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((t) => (t.id === id ? { ...t, concluida } : t)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const tarefasAlteradas: UpdateTarefaRequest[] = tarefasAtualizadas
        .filter(
          (tarefa) =>
            tarefa.concluida !==
            tarefas.find((t) => t.id === tarefa.id)?.concluida,
        )
        .map((tarefa) => ({
          tarefa_id: tarefa.id,
          concluida:
            tarefa.concluida.toString().charAt(0).toUpperCase() +
            tarefa.concluida.toString().slice(1),
        }));

      if (tarefasAlteradas.length === 0) {
        toast("Não houve alterações nas tarefas.");
        setIsSaving(false);
        return;
      }

      // Verifica se alguma tarefa foi desmarcada
      const tarefaDesmarcada = tarefasAtualizadas.find((tarefaAtual) => {
        const tarefaOriginal = tarefas.find((t) => t.id === tarefaAtual.id);
        return tarefaOriginal?.concluida && !tarefaAtual.concluida;
      });

      // Se uma tarefa foi desmarcada, encontra a etapa correspondente
      let etapaIdToSend: string;
      if (tarefaDesmarcada) {
        // Encontra a etapa da tarefa desmarcada
        etapaIdToSend = tarefaDesmarcada.etapa.id;
      } else {
        // Verifica se todas as tarefas da etapa atual foram concluídas
        const etapaAtual = etapas.find(
          (etapa) => etapa.id === processo.etapa?.id,
        );
        const tarefasDaEtapaAtual = tarefasAtualizadas.filter(
          (tarefa) => tarefa.etapa.id === processo.etapa?.id,
        );
        const todasTarefasConcluidas = tarefasDaEtapaAtual.every(
          (tarefa) => tarefa.concluida,
        );

        // Encontra a próxima etapa apenas se todas as tarefas foram concluídas
        const proximaEtapa =
          etapaAtual && todasTarefasConcluidas
            ? etapas.find((etapa) => etapa.ordem === etapaAtual.ordem + 1)
            : null;

        etapaIdToSend = proximaEtapa?.id || processo.etapa?.id || "";
      }

      if (!etapaIdToSend) {
        toast("Erro: Não foi possível identificar a etapa do processo.");
        setIsSaving(false);
        return;
      }

      const dataToSend: UpdateProcessoRequest = {
        processo_id: processo.id,
        etapa_id: etapaIdToSend,
        tarefas: tarefasAlteradas.map(({ tarefa_id, concluida }) => ({
          tarefa_id,
          concluida,
        })),
      };

      await updateProcesso(dataToSend);

      // Encontra a etapa para atualização local
      const novaEtapa = etapas.find((etapa) => etapa.id === etapaIdToSend);

      // Atualiza o processo local
      const updatedProcesso = {
        ...processo,
        tarefas: tarefasAtualizadas,
        etapa: novaEtapa || processo.etapa,
      };

      onSave(updatedProcesso);

      // Mostra mensagem adequada
      if (tarefaDesmarcada) {
        toast(`Processo retornou para a etapa: ${tarefaDesmarcada.etapa.nome}`);
      } else {
        const etapaAtual = etapas.find((e) => e.id === processo.etapa?.id);
        const novaEtapa = etapas.find((e) => e.id === etapaIdToSend);

        if (etapaAtual?.id !== novaEtapa?.id) {
          toast(`Processo movido para a etapa: ${novaEtapa?.nome}`);
        } else {
          toast("As alterações foram salvas com sucesso.");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações", error);
      toast("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log("Tarefas:", tarefas);
    console.log("Etapas:", etapas);
  }, [tarefas, etapas]);

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
                      <div className="space-y-2 pl-4">
                        {tarefasAtualizadas
                          .filter((tarefa) => tarefa.etapa.id === etapa.id)
                          .map((tarefa) => (
                            <div
                              key={tarefa.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={tarefa.id}
                                checked={tarefa.concluida}
                                onCheckedChange={(checked) =>
                                  handleTaskToggle(tarefa.id, Boolean(checked))
                                }
                              />
                              <label
                                htmlFor={tarefa.id}
                                className={`text-sm leading-none ${
                                  tarefa.concluida
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {tarefa.tarefa.descricao}
                              </label>
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
            <Label className="text-sm text-muted-foreground">
              Link para formulário
            </Label>
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
            variant="default"
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
