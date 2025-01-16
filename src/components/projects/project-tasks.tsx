"use client";

import { ProjectWithRelations } from "@/types/projects";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Database } from "@/types/database.types";
import { TaskWithRelations } from "@/types/tasks";

type DbTaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

interface ProjectTasksProps {
  project: ProjectWithRelations;
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tasks, isLoading, error, mutate } = useTasks(project.id);

  const handleCreateTask = async (data: DbTaskInsert) => {
    // Handle task creation
    console.log("Create task:", data);
    setDialogOpen(false);
  };

  const handleUpdateTask = async (task: DbTaskInsert, taskId: string) => {
    // Handle task update
    console.log("Update task:", task);
    await mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {error ? (
        <div className="text-red-500">Error loading tasks: {error.message}</div>
      ) : (
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onUpdate={handleUpdateTask}
        />
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        initialData={{
          project_id: project.id,
          status: "todo",
          priority: "medium",
        }}
      />
    </div>
  );
}
