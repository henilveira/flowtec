"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SlidersHorizontal, RotateCcw, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ProcessoPorEtapa, Processo } from "@/@types/Societario";

// Check if this component uses useSearchParams()
function SocietarioContent() {
  const {
    processos: processosCard,
    mutate: refetchProcessos,
    isLoading: isProcessosLoading,
  } = useProcessosByEtapas();
  const { etapas } = useListEtapas();
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Filter processes based on search query
  const filteredProcessos = useMemo(() => {
    if (!searchQuery.trim() || !processosCard) return processosCard;

    const query = searchQuery.toLowerCase().trim();

    // Create a new array with filtered processes while preserving the structure
    return processosCard.map((etapa: ProcessoPorEtapa) => ({
      ...etapa,
      processos: etapa.processos.filter((processo: Processo) =>
        processo.nome.toLowerCase().includes(query)
      ),
    }));
  }, [processosCard, searchQuery]);

  const memoizedSkeletonColumns = useMemo(
    () => (
      <div className="px-5 flex space-x-6 w-max">
        <SkeletonColumn title="Proposta/Formulário" count={0} />
        <SkeletonColumn title="Viabilidade" count={0} />
        <SkeletonColumn title="Registro" count={0} />
        <SkeletonColumn title="Alvarás" count={0} />
        <SkeletonColumn title="Simples/NF" count={0} />
        <SkeletonColumn title="Concluído" count={0} />
      </div>
    ),
    []
  );

  const memoizedButtonRefresh = useMemo(
    () => (
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
    ),
    [atualizarProcessos, isRefreshing, isProcessosLoading]
  );

  // const memoizedButtonFilter = useMemo(
  //   () => (
  //     <Button variant="outline" className="w-full sm:w-auto">
  //       <FilterDropdown>
  //         <span className="flex items-center justify-center">
  //           <SlidersHorizontal className="mr-2 h-4 w-4" />
  //           Filtrar
  //         </span>
  //       </FilterDropdown>
  //     </Button>
  //   ),
  //   []
  // );

  const memoizedSearchBar = useMemo(
    () => (
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar por nome..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    ),
    [searchQuery]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho fixo */}
      <div className="flex-none p-6">
        <Title titulo="Societário">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {memoizedSearchBar}
            <div className="flex flex-wrap gap-2">
              {memoizedButtonRefresh}
              {/* {memoizedButtonFilter} */}
              <Requisicao />
            </div>
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
                  {memoizedSkeletonColumns}
                </div>
              </div>
            ) : (
              <KanbanColumns
                processosCard={filteredProcessos}
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
            viewFormLink={
              detailedProcesso.formulario_abertura_id || detailedProcesso.id
            }
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

// Main component with Suspense in case it's needed for useSearchParams or other hooks
export default function Societario() {
  return (
    <Suspense fallback={<div>Carregando quadro societário...</div>}>
      <SocietarioContent />
    </Suspense>
  );
}
