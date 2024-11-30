'use client'

import { ReactNode } from 'react'
import Coluna from './colunas'
import { COLUMNS } from './constantes-cor'

interface KanbanColumnsProps {
  cards: Record<string, ReactNode>
}

export default function KanbanColumns({ cards }: KanbanColumnsProps) {
  return (
    <div className="flex gap-6 px-6 overflow-x-auto h-full">
      {COLUMNS.map((column) => (
        <div key={column.id} className="flex-shrink-0 min-w-[300px] max-w-[1fr]">
          <Coluna title={column.title}>
            <div className="space-y-4">
              {cards[column.id]}
            </div>
          </Coluna>
        </div>
      ))}
    </div>
  )
}
