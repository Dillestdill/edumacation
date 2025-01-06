import { Skeleton } from "@/components/ui/skeleton";

export const LoadingFallback = () => (
  <div className="min-h-screen bg-white p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-2xl" />
        <Skeleton className="h-8 w-full max-w-xl" />
        <Skeleton className="h-8 w-full max-w-lg" />
      </div>
    </div>
  </div>
);