'use client'
import { FilterIcon, Plus } from "lucide-react"
import Title from "../page-title"
import { Button } from "@/components/ui/button"
import { SelectContabilidade } from "./select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import KanbanColumns from "./quadro"
import Card from "./card"
import { STAGES } from "./constantes-cor"
import { Requisicao } from "./requisicao"

export default function Societario() {
  const cards = {
    [STAGES.PROPOSTA]: (
      <>
        <Card
          name="EcoWave"
          stage={STAGES.PROPOSTA}
          process="abertura_de_empresa"
          currentDay={33}
        />
        <Card
          name="Lego"
          stage={STAGES.PROPOSTA}
          process="abertura_contratual"
          currentDay={15}
        />
      </>
    ),
    [STAGES.VIABILIDADE]: (
      <Card
        name="Luz"
        stage={STAGES.VIABILIDADE}
        process="alteracao_contratual"
        currentDay={25}
      />
    ),
    [STAGES.ALVARAS]: (
      <>
        <Card
          name="Polar Carros"
          stage={STAGES.ALVARAS}
          process="transformacao"
          currentDay={48}
        />
        <Card
          name="Terrask"
          stage={STAGES.ALVARAS}
          process="abertura_de_empresa"
          currentDay={48}
        />
      </>
    ),
    [STAGES.SIMPLES]: (
      <Card
        name="Venom"
        stage={STAGES.SIMPLES}
        process="abertura_de_empresa"
        currentDay={70}
      />
    ),
    [STAGES.CONCLUSAO]: (
      <Card
        name="Lotus"
        stage={STAGES.CONCLUSAO}
        process="abertura_de_empresa"
        currentDay={54}
      />
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
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="h-full p-6">
            <KanbanColumns cards={cards} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}