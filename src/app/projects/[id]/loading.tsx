import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectLoading() {
  return (
    <div className="container py-6">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>

        <div className="flex items-center gap-4 border-t border-b py-4">
          <div>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[80px] mt-1" />
          </div>
          <div>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[80px] mt-1" />
          </div>
          <div>
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[80px] mt-1" />
          </div>
        </div>

        <Tabs defaultValue="tasks" className="mt-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[300px] mt-2" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded-lg p-6">
                <Skeleton className="h-6 w-[150px] mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
              <div className="border rounded-lg p-6">
                <Skeleton className="h-6 w-[150px] mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}