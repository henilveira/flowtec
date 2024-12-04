'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleColumnProps {
  title: string; // O nome da coluna
  count: number; // O número de processos
  children: React.ReactNode;
  className?: string;
}

export default function Coluna({ 
  title, 
  count, 
  children,
  className 
}: CollapsibleColumnProps) {
  return (
    <div
      className={cn(
        "grid grid-rows-[auto,1fr] h-full w-full max-w-xs rounded-xl border bg-background",
        className
      )}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <ChevronDown className="h-4 w-4 text-gray-400" />
          <span>{title}</span>
        </div>
        <span className="text-lg text-gray-500">{count}</span>
      </div>
      <div className="overflow-hidden">
        <div className="p-2 space-y-2 min-h-0">{children}</div>
      </div>
    </div>
  );
}
