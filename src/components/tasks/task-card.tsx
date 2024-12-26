import { Tables } from '@/types/database.types';

interface TaskCardProps {
  task: Tables<'tasks'>;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <h3 className="font-medium">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {task.status}
        </span>
        {task.due_date && (
          <span className="text-muted-foreground">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}