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
    processo: detailedProcesso,
    tarefas,
    isLoading: isProcessoLoading,
    isError,
  } = useProcessosById(processoId);

  const handleCardEdit = (processo: any) => setSelectedProcesso(processo);

  const handleSaveEdit = (updatedProcesso: any) => {
    console.log("Saving updated processo:", updatedProcesso);
    setSelectedProcesso(null);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonColumn title="Proposta/Formulário" count={0} />
      <SkeletonColumn title="Viabilidade" count={2} />
      <SkeletonColumn title="Registro" count={1} />
      <SkeletonColumn title="Alvarás" count={0} />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none">
        <Title titulo="Societário">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={atualizarProcessos}
              disabled={isRefreshing || isProcessosLoading}
            >
              <RotateCcw
                className={`mr-2 h-4 w-4 transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              {isRefreshing ? "Atualizando..." : "Atualizar"}
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

      <ScrollArea className="flex-1 w-full h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)]">
        <div className="min-h-[500px] flex-1 relative py-5 px-2 sm:px-5">
          {isProcessosLoading || isRefreshing ? (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10">
              {/* {renderSkeletonColumns()} */}
            </div>
          ) : (
            <KanbanColumns
              processosCard={processosCard}
              handleCardEdit={handleCardEdit}
              selectedProcessoId={selectedProcesso?.id}
            />
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {isProcessoLoading ? (
        <SkeletonSheet />
      ) : detailedProcesso ? (
        <EditSheet
          tarefas={tarefas || []}
          processo={detailedProcesso}
          etapas={etapas}
          onSave={handleSaveEdit}
          onCancel={() => setSelectedProcesso(null)}
          isLoading={isProcessoLoading}
        />
      ) : null}
    </div>
  );
}
