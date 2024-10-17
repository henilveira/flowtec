import { Card, CardContent } from "@/components/ui/card"
import { KanbanCard as KanbanCardType } from "@/@types/Kaban"

interface KanbanCardProps {
  card: KanbanCardType
  openEditCardSheet: (card: KanbanCardType) => void
}

export default function KanbanCard({ card, openEditCardSheet }: KanbanCardProps) {
  return (
    <Card className={`overflow-hidden cursor-pointer`} onClick={() => openEditCardSheet(card)}>
      <CardContent className={`p-4 bg-gradient-to-br ${card.color}`}>
        <h3 className="font-semibold mb-1">{card.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{card.description}</p>
        <div className="text-xs text-gray-500">
          <p>Início: {card.startDate}</p>
          <p>Processos concluídos: {card.completedProcesses.length}</p>
        </div>
      </CardContent>
    </Card>
  )
}
