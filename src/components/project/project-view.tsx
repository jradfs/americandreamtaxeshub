"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "@/components/ui/use-toast";
import type { TaskFormData } from "@/types/tasks";

interface ProjectViewProps {
  projectId: string;
  project?: {
    name: string;
    description?: string;
    status: string;
    client?: {
      name: string;
    };
  };
}

export function ProjectView({ projectId, project }: ProjectViewProps) {
  const {
    tasks = [],
    isLoading,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks({ projectId });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = async (action: string, fn: () => Promise<unknown>) => {
    try {
      await fn();
      toast({
        title: "Success",
        description: `Task ${action} successfully.`,
      });
    } catch (error) {
      console.error(`Error ${action} task:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} task.`,
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    await handleAction("created", () => addTask({ ...data, project_id: projectId }));
    setIsDialogOpen(false);
  };

  const handleUpdateTask = async (taskId: string, data: TaskFormData) => {
    await handleAction("updated", () => updateTask(taskId, data));
  };

  const handleDeleteTask = async (taskId: string) => {
    await handleAction("deleted", () => deleteTask(taskId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{project?.name}</h1>
          {project?.description && (
            <p className="text-gray-600">{project.description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
              {project?.status}
            </span>
            {project?.client && (
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
                Client: {project.client.name}
              </span>
            )}
          </div>
        </div>

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
          totalTasks={tasks.length}
          currentPage={1}
          totalPages={1}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onPageChange={() => {}}
        />

        <TaskDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSubmit={handleCreateTask}
        />
      </div>
    </div>
  );
}
