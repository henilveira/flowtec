"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  useProcessosByEtapas,
  useProcessosById,
  useListEtapas,
} from "@/hooks/useSocietario";
import KanbanColumns from "./quadro";
import EditSheet from "./editCard";
import Title from "../page-title";
import FilterDropdown from "./filter";
import { Requisicao } from "./requisicao";
import { SkeletonColumn } from "@/components/skeleton-column";
import { SkeletonSheet } from "@/components/skeleton-sheet";
import { Skeleton } from "@/components/ui/skeleton";

export default function Societario() {
  const {
    processos: processosCard,
    mutate: refetchProcessos,
    isLoading: isProcessosLoading,
  } = useProcessosByEtapas();
  const { etapas } = useListEtapas();
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const processoId = selectedProcesso?.id ?? null;
  const {
    mutate,
    processo: detailedProcesso,
    tarefas,
    isLoading: isProcessoLoading,
    isError,
  } = useProcessosById(processoId);

  const handleCardEdit = (processo: any) => setSelectedProcesso(processo);

  const handleSaveEdit = async (updatedProcesso: any) => {
    try {
      console.log("Saving updated processo:", updatedProcesso);
      setSelectedProcesso(null);

      // Atualiza os dados localmente
      await Promise.all([mutate(), refetchProcessos()]);

      // Adicione aqui uma notificação de sucesso se desejar
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      // Adicione aqui uma notificação de erro se desejar

      // Opcionalmente, você pode reabrir o modal de edição
      setSelectedProcesso(updatedProcesso);
    }
  };

  const atualizarProcessos = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchProcessos();
    } catch (error) {
      console.error("Erro ao atualizar processos:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchProcessos]);

  const renderSkeletonColumns = () => (
    <div className="px-5 flex space-x-6 w-max">
      <SkeletonColumn title="Proposta/Formulário" count={0} />
      <SkeletonColumn title="Viabilidade" count={0} />
      <SkeletonColumn title="Registro" count={0} />
      <SkeletonColumn title="Alvarás" count={0} />
      <SkeletonColumn title="Simples/NF" count={0} />
      <SkeletonColumn title="Concluído" count={0} />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho fixo */}
      <div className="flex-none p-6">
        <Title titulo="Societário">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={atualizarProcessos}
              disabled={isRefreshing || isProcessosLoading}
            >
              <RotateCcw
                className={`h-4 w-4 transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FilterDropdown>
                <span className="flex items-center justify-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtrar
                </span>
              </FilterDropdown>
            </Button>
            <Requisicao />
          </div>
        </Title>
      </div>

      {/* Área do Kanban com scroll horizontal */}
      <div className="flex-1 min-h-0">
        {" "}
        {/* min-h-0 é importante para o flex funcionar corretamente */}
        <ScrollArea className="h-full">
          <div className="p-6">
            {isProcessosLoading || isRefreshing ? (
              <div className="relative">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10">
                  {renderSkeletonColumns()}
                </div>
              </div>
            ) : (
              <KanbanColumns
                processosCard={processosCard}
                handleCardEdit={handleCardEdit}
                selectedProcessoId={selectedProcesso?.id}
              />
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Sheet para edição - permanece no final */}
      {selectedProcesso ? (
        isProcessoLoading ? (
          <SkeletonSheet />
        ) : detailedProcesso ? (
          <EditSheet
            viewFormLink={detailedProcesso.id}
            tarefas={tarefas || []}
            processo={detailedProcesso}
            etapas={etapas}
            onSave={handleSaveEdit}
            onCancel={() => setSelectedProcesso(null)}
            isLoading={isProcessoLoading}
          />
        ) : null
      ) : null}
    </div>
  );
}
