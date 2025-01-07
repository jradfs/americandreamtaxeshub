'use client'

import { ProjectWithRelations } from "@/types/projects"
import { TaskList } from "@/components/tasks/task-list"
import { useTasks } from "@/hooks/useTasks"
import { TaskFormValues } from "@/lib/validations/task"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Task } from "@/types/tasks"

interface ProjectTasksProps {
  project: ProjectWithRelations
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tasks, isLoading, createTask, updateTask, deleteTask, reorderTasks } = useTasks({
    projectId: project.id
  });

  const handleCreate = async (task: TaskFormValues) => {
    try {
      await createTask({ ...task, project_id: project.id });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEdit = async (index: number, task: TaskFormValues) => {
    const taskToUpdate = tasks[index];
    if (taskToUpdate && 'id' in taskToUpdate) {
      try {
        await updateTask(taskToUpdate.id, task);
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const handleDelete = async (index: number) => {
    const task = tasks[index];
    if (task && 'id' in task) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleReorder = async (reorderedTasks: TaskFormValues[]) => {
    try {
      // Find the corresponding task for each reordered task
      const tasksToReorder = reorderedTasks.map((reorderedTask, index) => {
        const originalTask = tasks.find(t => t.title === reorderedTask.title);
        if (!originalTask) {
          throw new Error(`Could not find original task for ${reorderedTask.title}`);
        }
        return originalTask;
      });
      await reorderTasks(tasksToReorder);
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Project Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreate}
      />
    </div>
  )
}