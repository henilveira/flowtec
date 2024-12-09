import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card className="w-full p-4 mb-4 bg-blue-500/20 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 bg-blue-500/30" />
          <Skeleton className="h-6 w-20 rounded-full bg-green-500/30" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 bg-blue-500/30" />
          <Skeleton className="h-4 w-16 bg-blue-500/30" />
        </div>
        <Skeleton className="h-2 w-full bg-blue-500/30 rounded-full" />
      </div>
    </Card>
  )
}

