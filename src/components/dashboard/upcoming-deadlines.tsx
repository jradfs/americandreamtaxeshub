"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

export function UpcomingDeadlines() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-deadlines"],
    queryFn: async () => {
      const { data: taxDeadlines } = await supabaseBrowserClient
        .from("tax_returns")
        .select("due_date, status")
        .gte("due_date", new Date().toISOString())
        .order("due_date", { ascending: true })
        .limit(5);

      const { data: calendarEvents, error: calendarError } =
        await supabaseBrowserClient
          .from("calendar_events")
          .select("start_time, title")
          .gte("start_time", new Date().toISOString())
          .order("start_time", { ascending: true })
          .limit(5);

      if (calendarError) throw calendarError;

      return [
        ...(taxDeadlines?.map((d) => ({
          date: d.due_date,
          title: `Tax Return Due (${d.status})`,
        })) || []),
        ...(calendarEvents?.map((e) => ({
          date: e.start_time,
          title: e.title,
        })) || []),
      ]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading upcoming deadlines</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline>
          {data?.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < data.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className="text-sm font-medium">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.title}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
