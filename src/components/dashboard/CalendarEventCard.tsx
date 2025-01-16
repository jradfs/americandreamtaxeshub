import { CalendarEvent } from "@/types/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { format } from "date-fns";

interface CalendarEventCardProps {
  event: CalendarEvent;
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {format(new Date(event.start), "MMM d, yyyy h:mm a")} -
          {format(new Date(event.end), "h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </CardContent>
    </Card>
  );
}
