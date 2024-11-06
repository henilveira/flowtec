'use client'

import { FilterIcon, ChevronRightIcon } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import Title from "../page-title"
import { Button } from "@/components/ui/button"
import { SelectContabilidade } from "./select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import KanbanColumns from "./quadro"
import Card from "./card"
import { STAGES } from "./constantes-cor"
import { Requisicao } from "./requisicao"
import EditCard from "./editCard"

export default function Societario() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showScrollArrow, setShowScrollArrow] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollAreaRef.current
        setShowScrollArrow(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth)
      }
    }

    checkScroll()

    // Adiciona eventos para redimensionamento e rolagem
    window.addEventListener('resize', checkScroll)
    scrollAreaRef.current?.addEventListener('scroll', checkScroll)

    return () => {
      window.removeEventListener('resize', checkScroll)
      scrollAreaRef.current?.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const ScrollArrow = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="outline"
      size="icon"
      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </Button>
  )

  const cards = {
    [STAGES.PROPOSTA]: (
      <>
        <EditCard triggerContent={
          <Card
            name="EcoWave"
            stage={STAGES.PROPOSTA}
            process="abertura_de_empresa"
            currentDay={33} startDate={""}          />
        } />
        <EditCard triggerContent={
          <Card
            name="Lego"
            stage={STAGES.PROPOSTA}
            process="abertura_contratual"
            currentDay={15} startDate={""}          />
        } />
      </>
    ),
    [STAGES.VIABILIDADE]: (
      <EditCard triggerContent={
        <Card
          name="Luz"
          stage={STAGES.VIABILIDADE}
          process="alteracao_contratual"
          currentDay={25} startDate={""}        />
      } />
    ),
    [STAGES.ALVARAS]: (
      <>
        <EditCard triggerContent={
          <Card
            name="Polar Carros"
            stage={STAGES.ALVARAS}
            process="transformacao"
            currentDay={48} startDate={""}          />
        } />
        <EditCard triggerContent={
          <Card
            name="Terrask"
            stage={STAGES.ALVARAS}
            process="abertura_de_empresa"
            currentDay={48} startDate={""}          />
        } />
      </>
    ),
    [STAGES.SIMPLES]: (
      <EditCard triggerContent={
        <Card
          name="Venom"
          stage={STAGES.SIMPLES}
          process="abertura_de_empresa"
          currentDay={70} startDate={""}        />
      } />
    ),
    [STAGES.CONCLUSAO]: (
      <EditCard triggerContent={
        <Card
          name="Lotus"
          stage={STAGES.CONCLUSAO}
          process="abertura_de_empresa"
          currentDay={54} startDate={""}        />
      } />
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Title titulo="Societário">
          <SelectContabilidade />
          <Button variant="outline">
            <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
          </Button>
          <Requisicao />
        </Title>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="h-full p-6 flex">
            <KanbanColumns cards={cards} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {showScrollArrow && <ScrollArrow onClick={handleScroll} />}
      </div>
    </div>
  )
}
