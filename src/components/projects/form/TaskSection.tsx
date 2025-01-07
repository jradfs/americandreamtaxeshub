'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { Task, TaskFormData } from '@/types/tasks';
import { TemplateTask } from '@/lib/validations/project';

interface TaskSectionProps {
  projectId: string;
  tasks: TemplateTask[];
  onAddTask: (task: TaskFormData) => void;
  onEditTask: (index: number, task: Task | TaskFormData) => void;
  onDeleteTask: (index: number) => void;
  onReorderTasks: (tasks: TemplateTask[]) => void;
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

  const handleAddTask = async (task: TaskFormData) => {
    try {
      await onAddTask({
        ...task,
        project_id: projectId,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (index: number, task: Task | TaskFormData) => {
    try {
      await onEditTask(index, task);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (index: number) => {
    try {
      await onDeleteTask(index);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleReorderTasks = async (reorderedTasks: TemplateTask[]) => {
    try {
      await onReorderTasks(reorderedTasks);
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
    }
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
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onReorder={handleReorderTasks}
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