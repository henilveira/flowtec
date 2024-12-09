import { SkeletonCard } from "./skeleton-card";

interface SkeletonColumnProps {
  title: string;
  count?: number;
}

export function SkeletonColumn({ title, count = 0 }: SkeletonColumnProps) {
  return (
      <div className="p-3 grid grid-rows-[auto,1fr] h-screen w-[500px] max-w-xs rounded-xl border bg-background">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
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
