'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import { useTasks } from '@/hooks/useTasks';
import { toast } from '@/components/ui/use-toast';
import type { TaskFormData } from '@/types/tasks';

export function ProjectView({ projectId }: { projectId: string }) {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks({ projectId });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (action: string, fn: () => Promise<unknown>) => {
    try {
      await fn();
      toast({
        title: 'Success',
        description: `Task ${action} successfully.`,
      });
    } catch (error) {
      console.error(`Error ${action} task:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} task.`,
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    await handleAction('created', () => createTask(data));
    setIsDialogOpen(false);
  };

  const handleUpdateTask = async (taskId: string, data: TaskFormData) => {
    await handleAction('updated', () => updateTask(taskId, data));
  };

  const handleDeleteTask = async (taskId: string) => {
    await handleAction('deleted', () => deleteTask(taskId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
