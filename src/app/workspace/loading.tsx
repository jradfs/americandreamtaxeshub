import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="grid gap-6 mt-6">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}