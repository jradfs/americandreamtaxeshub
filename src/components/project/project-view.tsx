'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormData, TaskUpdate } from '@/types/tasks';
import { TemplateTask } from '@/lib/validations/project';
import { toast } from '@/components/ui/use-toast';

interface ProjectViewProps {
  projectId: string;
}

export function ProjectView({ projectId }: ProjectViewProps) {
  const { tasks: clientTasks, isLoading, createTask, updateTask, deleteTask, reorderTasks } = useTasks(projectId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = async (data: TaskFormData) => {
    try {
      await createTask({
        ...data,
        project_id: projectId,
      });
      setIsDialogOpen(false);
      toast({
        title: 'Task created',
        description: 'Task has been created successfully'
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditTask = async (index: number, task: Task | TaskFormData) => {
    if ('id' in task) {
      try {
        const updateData: TaskUpdate = {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          start_date: task.start_date,
          assignee_id: task.assignee_id,
          project_id: task.project_id,
        };
        await updateTask(updateData);
        toast({
          title: 'Task updated',
          description: 'Task has been updated successfully'
        });
      } catch (error) {
        console.error('Failed to update task:', error);
        toast({
          title: 'Error',
          description: 'Failed to update task. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleDeleteTask = async (index: number) => {
    const task = clientTasks[index];
    if ('id' in task) {
      try {
        await deleteTask(task.id);
        toast({
          title: 'Task deleted',
          description: 'Task has been deleted successfully'
        });
      } catch (error) {
        console.error('Failed to delete task:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete task. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleReorderTasks = async (reorderedTasks: (Task | TaskFormData | TemplateTask)[]) => {
    try {
      const validTasks = reorderedTasks.filter((task): task is Task => 'id' in task) as Task[];
      await reorderTasks(validTasks);
      toast({
        title: 'Tasks reordered',
        description: 'Tasks have been reordered successfully'
      });
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder tasks. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Project Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <TaskList
            tasks={clientTasks}
            isLoading={isLoading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onReorder={handleReorderTasks}
          />
        </CardContent>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
