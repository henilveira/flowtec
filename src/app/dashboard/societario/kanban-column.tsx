import { MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { KanbanCard, Stage } from "@/@types/Kaban"

type KanbanColumnProps = {
  stage: Stage
  stageIndex: number
  cards: KanbanCard[]
  onCardClick: (card: KanbanCard) => void
}

export function KanbanColumn({ stage, stageIndex, cards, onCardClick }: KanbanColumnProps) {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold flex items-center justify-between">
        {stage.name}
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </h2>
      {cards.map((card) => (
        <Card key={card.id} className={`overflow-hidden cursor-pointer`} onClick={() => onCardClick(card)}>
          <CardContent className={`p-4 bg-gradient-to-br ${card.color}`}>
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{card.description}</p>
            <div className="text-xs text-gray-500">
              <p>Início: {card.startDate}</p>
              <p>Tarefas concluídas: {card.completedProcesses.length}/{stage.processes.length}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}