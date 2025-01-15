import { CalendarEvent } from "@/types/calendar";
import { CalendarEventCard } from "./CalendarEventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarProps {
  events: CalendarEvent[];
  isLoading?: boolean;
}

export function Calendar({ events, isLoading }: CalendarProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No upcoming events
      </div>
    );
  }

  const eventTypes = Array.from(new Set(events.map((e) => e.type)));

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        {eventTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {events.map((event) => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </TabsContent>

      {eventTypes.map((type) => (
        <TabsContent key={type} value={type} className="space-y-4">
          {events
            .filter((event) => event.type === type)
            .map((event) => (
              <CalendarEventCard key={event.id} event={event} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
