'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { useTasks } from '@/hooks/useTasks';
import { Database } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

const handleError = (action: string, error: unknown) => {
  console.error(`Failed to ${action}:`, error);
  toast({ title: 'Error', description: `Failed to ${action}`, variant: 'destructive' });
};

export function ProjectView({ projectId }: { projectId: string }) {
  const { tasks, isLoading, createTask, updateTask, deleteTask, reorderTasks } = useTasks(projectId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (action: string, fn: () => Promise<unknown>) => {
    try {
      await fn();
      toast({ title: 'Success', description: `${action} successfully` });
    } catch (error) {
      handleError(action, error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Project Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Task</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onUpdate={(task, index) => handleAction('update task', () => updateTask(index, task))}
            onDelete={(index) => handleAction('delete task', () => deleteTask(index))}
            onReorder={(tasks) => handleAction('reorder tasks', () => reorderTasks(tasks))}
          />
        </CardContent>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(data) => handleAction('create task', async () => {
          await createTask({ ...data, project_id: projectId });
          setIsDialogOpen(false);
        })}
      />
    </div>
  );
}
