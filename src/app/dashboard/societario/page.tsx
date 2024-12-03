"use client";

import { FilterIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Title from "../page-title";
import { Button } from "@/components/ui/button";
import { SelectContabilidade } from "./select-contabilidade";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import KanbanColumns from "./quadro";
import Card from "./card";
import { STAGES } from "./constantes-cor";
import { Requisicao } from "./requisicao";
import EditCard from "./editCard";
import FilterDropdown from "./filter";

export default function Societario() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);

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

    // Adiciona eventos para redimensionamento e rolagem
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
    <div className="flex flex-col overflow-x-hidden h-full">
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

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="h-full overflow-hidden p-6 flex">
            <KanbanColumns cards={Card} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {showScrollArrow && <ScrollArrow onClick={handleScroll} />}
      </div>
    </div>
  );
}
