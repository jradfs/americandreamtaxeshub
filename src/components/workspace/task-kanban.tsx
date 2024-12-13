'use client';

import { Task } from '@/types/task-management';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './task-card';

interface TaskKanbanProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function TaskKanban({ tasks, onUpdateTask }: TaskKanbanProps) {
  const columns = {
    todo: tasks.filter(task => task.status === 'todo'),
    complete: tasks.filter(task => task.status === 'complete'),
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {Object.entries(columns).map(([status, statusTasks]) => (
        <div key={status} className="flex-1">
          <h3 className="text-lg font-semibold mb-3 capitalize">
            {status}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({statusTasks.length})
            </span>
          </h3>
          
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-2 pr-4">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
