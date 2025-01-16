import { TaskSummary } from "./TaskSummary";
import { Calendar } from "./Calendar";
import { CalendarEvent } from "@/types/calendar";

interface DashboardShellProps {
  children?: React.ReactNode;
  calendarEvents: CalendarEvent[];
}

export function DashboardShell({
  children,
  calendarEvents,
}: DashboardShellProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TaskSummary />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Calendar events={calendarEvents} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}
