import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full p-3 mb-4 bg-white rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-zinc-100" />
        </div>
        <div>
          <Skeleton className="h-6 w-20 rounded-full bg-green-500/30" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-2 w-9 bg-zinc-100" />
          <Skeleton className="h-2 w-9 bg-zinc-100" />
        </div>
        <Skeleton className="h-2 w-full bg-green-500/30 rounded-full" />
      </div>
    </Card>
  );
}
