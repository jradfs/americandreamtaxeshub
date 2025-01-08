'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskDialog } from '@/components/tasks/task-dialog';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

interface TaskSectionProps {
  projectId: string;
  tasks: DbTaskInsert[];
  onAddTask: (task: DbTaskInsert) => void;
  onEditTask: (task: DbTaskInsert, index: number) => void;
  onDeleteTask: (index: number) => void;
  onReorderTasks: (tasks: DbTaskInsert[]) => void;
}

export function TaskSection({
  projectId,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
}: TaskSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = async (task: DbTaskInsert) => {
    onAddTask({
      ...task,
      project_id: projectId,
      activity_log: [],
      checklist: [],
    });
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tasks</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          onUpdate={onEditTask}
          onDelete={onDeleteTask}
          onReorder={onReorderTasks}
        />

        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddTask}
        />
      </CardContent>
    </Card>
  );
} 