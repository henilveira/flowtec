'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronRightIcon, FilterIcon, SlidersHorizontal } from 'lucide-react';
import { getProcessosByEtapas } from '@/hooks/useSocietario';
import KanbanColumns from './quadro';
import EditSheet from './editCard';
import Title from '../page-title';
import FilterDropdown from './filter';
import { Requisicao } from './requisicao';

export default function Societario() {
  const { processos: processosCard } = getProcessosByEtapas();
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleCardEdit = (processo: any) => {
    setSelectedProcesso(processo);
  };

  const handleScroll = () => {
    scrollAreaRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollAreaRef.current;
        setShowScrollArrow(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    scrollAreaRef.current?.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      scrollAreaRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const handleSaveEdit = (updatedProcesso: any) => {
    // Implement your save logic here if needed
    setSelectedProcesso(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none">
        <Title titulo="Societário">
          <div className="flex flex-wrap gap-2">
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

      {/* Quadro Societario */}
      <ScrollArea className="flex-1 w-full h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)]">
        <div className="min-h-[500px] flex-1 relative py-5 px-2 sm:px-5" ref={scrollAreaRef}>
          <KanbanColumns 
            processosCard={processosCard} 
            handleCardEdit={handleCardEdit}
            selectedProcessoId={selectedProcesso?.id}
          />
          {showScrollArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleScroll}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {selectedProcesso && (
        <EditSheet
          processo={selectedProcesso}
          onSave={handleSaveEdit}
          onCancel={() => setSelectedProcesso(null)}
        />
      )}
    </div>
  );
}

