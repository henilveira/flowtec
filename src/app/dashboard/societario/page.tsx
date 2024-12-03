// Societario.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, FilterIcon } from "lucide-react";
import { getProcessosByEtapas } from "@/hooks/useSocietario";
import KanbanColumns from "./quadro"; // Componente KanbanColumns
import EditCard from "./editCard"; // Modal de edição de card
import Title from "../page-title";
import FilterDropdown from "./filter";
import { Requisicao } from "./requisicao";

export default function Societario() {
  const { processos } = getProcessosByEtapas();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCardEdit = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsEditModalOpen(true);
  };

  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollAreaRef.current;
        setShowScrollArrow(
          scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth
        );
      }
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);
    scrollAreaRef.current?.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
      scrollAreaRef.current?.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const ScrollArrow = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="outline"
      size="icon"
      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex flex-col  h-full">
      <div className="flex-none">
        <Title titulo="Societário">
          <Button variant="outline">
            <FilterDropdown>
              <div>
                <span className="flex items-center justify-center">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filtrar
                </span>
              </div>
            </FilterDropdown>
          </Button>
          <Requisicao />
        </Title>
      </div>

      <div className="flex flex-col h-full">
        <div
          className="flex-1 flex overflow-x-auto relative"
          ref={scrollAreaRef}
        >
          <KanbanColumns
            processos={processos}
            handleCardEdit={handleCardEdit}
          />

          {showScrollArrow && <ScrollArrow onClick={handleScroll} />}
        </div>

        {isEditModalOpen && selectedCardId && (
          <EditCard
            cardId={selectedCardId}
            onClose={() => {
              setSelectedCardId(null);
              setIsEditModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
