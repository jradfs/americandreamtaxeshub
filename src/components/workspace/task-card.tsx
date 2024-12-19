'use client';

import { Task } from '@/types/task-management';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, isOverdue, DATE_FORMATS } from '@/lib/date-utils';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const handleStatusChange = () => {
    onUpdate({
      ...task,
      status: task.status === 'done' ? 'todo' : 'done',
      updated_at: new Date().toISOString(),
    });
  };

  const isTaskOverdue = isOverdue(task.due_date);

  return (
    <div className="group px-4 py-2 hover:bg-accent rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.status === 'done'}
          onCheckedChange={handleStatusChange}
          className="mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </span>
            {isTaskOverdue && task.status !== 'done' && (
              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
            )}
          </div>
          
          {(task.due_date || task.priority) && (
            <div className="flex items-center gap-2 mt-1">
              {task.due_date && (
                <span className={`text-xs ${isTaskOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                  Due {formatDate(task.due_date, DATE_FORMATS.SHORT)}
                </span>
              )}
              {task.priority && (
                <span className={`text-xs capitalize ${
                  task.priority === 'high' ? 'text-red-500' : 
                  task.priority === 'medium' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {task.priority}
                </span>
              )}
            </div>
          )}
        </div>

        {task.assigned_user_id && (
          <Avatar className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <AvatarFallback className="text-xs">
              {task.assigned_user_id.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
