'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleColumnProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function Coluna({ 
  title, 
  children,
  className 
}: CollapsibleColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "grid grid-rows-[auto,1fr] h-full w-full max-w-xs rounded-xl border bg-background transition-all duration-300 ease-in-out",
      isCollapsed && "grid-rows-[auto,0fr]",
      className
    )}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 p-4 text-2xl font-bold hover:bg-muted/50 transition-colors"
      >
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-300",
          isCollapsed ? "-rotate-90" : "rotate-0"
        )} />
        {title}
        <div className='h-2 bg-black'></div>
      </button>
      
      <div className="overflow-hidden transition-all duration-300 ease-in-out">
        <div className={cn(
          "p-2 space-y-2 min-h-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "opacity-0 transform -translate-y-2" : "opacity-100 transform translate-y-0"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}