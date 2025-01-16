import { useState } from "react";
import { TaskDialog } from "./task-dialog";
import { TaskCard } from "./task-card";
import { TaskFormData, TaskWithRelations, toDbTaskInsert } from "@/types/tasks";

interface ProjectTasksProps {
  project: {
    id: string;
    name: string;
  };
  tasks: TaskWithRelations[];
  onTaskCreate: (task: TaskFormData) => Promise<void>;
  onTaskUpdate: (taskId: string, task: TaskFormData) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

export function ProjectTasks({
  project,
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(
    null,
  );

  const handleCreateTask = async (data: TaskFormData) => {
    await onTaskCreate(data);
    setDialogOpen(false);
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, data);
      setEditingTask(null);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setDialogOpen(true)}>Add Task</button>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => setEditingTask(task)}
            onDelete={onTaskDelete}
          />
        ))}
      </div>

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

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
}
