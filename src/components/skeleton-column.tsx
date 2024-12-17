import { ChevronDown } from "lucide-react";
import { SkeletonCard } from "./skeleton-card";

interface SkeletonColumnProps {
  title: string;
  count?: number;
}

export function SkeletonColumn({ title, count = 0 }: SkeletonColumnProps) {
  return (
    <div className="grid grid-rows-[auto,1fr] h-screen w-[300px] max-w-xs rounded-xl border bg-zinc-50">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <ChevronDown className="h-4 w-4 text-gray-400" />

          <span>{title}</span>
        </div>
        <span className="text-sm text-gray-500">{count}</span>
      </div>
      <div className="p-3 overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
