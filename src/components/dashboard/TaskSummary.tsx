import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const fetchTasks = async () => {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export function TaskSummary() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const overdueTasks =
    tasks?.filter((task) => {
      const dueDate = new Date(task.due_date);
      return dueDate < today && !task.completed_at;
    }) || [];

  const dueTodayTasks =
    tasks?.filter((task) => {
      const dueDate = new Date(task.due_date);
      return (
        dueDate >= today &&
        dueDate < new Date(today.getTime() + 86400000) &&
        !task.completed_at
      );
    }) || [];

  const upcomingTasks =
    tasks?.filter((task) => {
      const dueDate = new Date(task.due_date);
      return (
        dueDate >= new Date(today.getTime() + 86400000) && !task.completed_at
      );
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Overdue</h3>
          {overdueTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">Overdue</Badge>
              <span>{task.title}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Due Today</h3>
          {dueTodayTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Today</Badge>
              <span>{task.title}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Upcoming</h3>
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 mb-2">
              <Badge variant="default">
                {format(new Date(task.due_date), "MMM d")}
              </Badge>
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
