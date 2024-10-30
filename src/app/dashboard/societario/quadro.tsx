'use client'

import { ReactNode } from 'react'
import Coluna from './colunas'
import { COLUMNS } from './constantes-cor'

interface KanbanColumnsProps {
  cards: Record<string, ReactNode>
}

export default function KanbanColumns({ cards }: KanbanColumnsProps) {
  return (
    <div className="flex gap-6 min-w-max px-6">
      {COLUMNS.map((column) => (
        <Coluna key={column.id} title={column.title}>
          <div className="space-y-4">
            {cards[column.id]}
          </div>
        </Coluna>
      ))}
    </div>
  )
}