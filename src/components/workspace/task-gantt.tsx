import { Task } from '@/types/task-management';
import { Card } from '@/components/ui/card';

interface TaskGanttProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function TaskGantt({ tasks, onUpdateTask }: TaskGanttProps) {
  // This is a placeholder. In a real implementation, we would use a proper Gantt chart library
  // such as dhtmlxGantt or similar
  return (
    <Card className="p-4 h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Gantt chart view coming soon...
      </div>
    </Card>
  );
}
