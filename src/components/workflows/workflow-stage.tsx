import { Tables } from '@/types/database.types';
import { Database } from '@/types/database.types';
import TaskCard from '../tasks/task-card';

interface WorkflowStageProps {
  stageName: string;
  tasks: Tables<'tasks'>[];
}

type TaskCardTask = {
  id: string;
  title: string;
  description?: string | null;
  status: Database['public']['Enums']['task_status'];
  priority?: Database['public']['Enums']['task_priority'];
  category?: Database['public']['Enums']['service_type'] | null;
  due_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  project_id?: string | null;
}

export default function WorkflowStage({ stageName, tasks }: WorkflowStageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{stageName}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={{
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status as Database['public']['Enums']['task_status'],
              priority: task.priority as Database['public']['Enums']['task_priority'],
              category: task.category as Database['public']['Enums']['service_type'],
              due_date: task.due_date,
              created_at: task.created_at,
              updated_at: task.updated_at,
              project_id: task.project_id
            }} 
          />
        ))}
      </div>
    </div>
  );
}