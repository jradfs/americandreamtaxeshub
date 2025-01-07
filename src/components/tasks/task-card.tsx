import type { Task } from '@/types/tasks'
import type { Database } from '@/types/database.types'
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string | null
    status: Database['public']['Enums']['task_status']
    priority?: Database['public']['Enums']['task_priority']
    category?: Database['public']['Enums']['service_type'] | null
    due_date?: string | null
    created_at?: string | null
    updated_at?: string | null
    project_id?: string | null
  }
  onStatusChange?: (status: Database['public']['Enums']['task_status']) => void
  onDelete?: () => void
  onEdit?: () => void
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{task.title}</h3>
        {task.category && (
          <Badge variant="outline" className="text-sm">
            {task.category}
          </Badge>
        )}
      </div>
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
