"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskDialog } from "./task-dialog";
import { TaskWithRelations, TaskFormData, toTaskFormData } from "@/types/tasks";
import { ErrorBoundary } from "react-error-boundary";

interface TaskListProps {
  tasks: TaskWithRelations[];
  isLoading?: boolean;
  totalTasks: number;
  currentPage: number;
  totalPages: number;
  onUpdate: (taskId: string, data: TaskFormData) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onCreate?: (data: TaskFormData) => Promise<void>;
  onPageChange: (page: number) => void;
  onViewSubtasks?: (taskId: string) => void;
  showSubtasks?: boolean;
}

export function TaskList({
  tasks,
  isLoading = false,
  totalTasks,
  currentPage,
  totalPages,
  onUpdate,
  onDelete,
  onCreate,
  onPageChange,
}: TaskListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(
    null,
  );

  const handleSubmit = async (data: TaskFormData) => {
    if (selectedTask) {
      await onUpdate(selectedTask.id, data);
    } else if (onCreate) {
      await onCreate(data);
    }
    setDialogOpen(false);
    setSelectedTask(null);
  };

  // Prefetch next page when near the end of the list
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      },
      { threshold: 0.5 },
    );

    const sentinel = document.getElementById("task-list-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [currentPage, totalPages, onPageChange]);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="p-4 border rounded bg-red-50">
          <h3 className="font-medium text-red-600">Error loading tasks</h3>
          <p className="text-sm text-red-500">{error.message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}
    >
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>No tasks found</CardTitle>
              <CardDescription>
                {onCreate
                  ? "Create a new task to get started."
                  : "No tasks match your criteria."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {task.status}
                      </span>
                      {task.priority && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {currentPage < totalPages && (
              <div id="task-list-sentinel" className="h-4" />
            )}
            {isLoading && (
              <Card className="p-4">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            )}
          </>
        )}

        <TaskDialog
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          taskData={selectedTask}
          onSubmit={handleSubmit}
        />
      </div>
    </ErrorBoundary>
  );
}
