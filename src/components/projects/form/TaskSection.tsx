'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import { useTasks } from '@/hooks/useTasks';
import { toast } from '@/components/ui/use-toast';
import type { TaskFormData, TaskWithRelations } from '@/types/tasks';

interface TaskSectionProps {
  projectId: string;
}

export function TaskSection({ projectId }: TaskSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks({ projectId });

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, data: TaskFormData) => {
    try {
      await updateTask(taskId, data);
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
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