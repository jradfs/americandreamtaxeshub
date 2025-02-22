"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskDialog } from "./task-dialog";
import { TaskItem } from "./task-item";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { ErrorBoundary } from "@/components/error-boundary";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TaskDependencyGraph } from "@/components/workflows/TaskDependencyGraph";
import { cn } from "@/lib/utils";

interface TaskContainerProps {
  projectId?: string;
}

export function TaskContainer({ projectId }: TaskContainerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showDependencyGraph, setShowDependencyGraph] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  const {
    tasks,
    totalTasks,
    totalPages,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    prefetchNextPage,
  } = useTasks({
    projectId,
    page: currentPage,
    includeRelations: showDetails,
  });

  if (error) {
    throw error;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleShowDetailsToggle = () => {
    setShowDetails(!showDetails);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update task priorities based on new order
    items.forEach((task, index) => {
      updateTask(task.id, { priority: index });
    });
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Task
            </Button>
            <Button variant="outline" onClick={handleShowDetailsToggle}>
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDependencyGraph(!showDependencyGraph)}
            >
              {showDependencyGraph ? "Hide Dependencies" : "Show Dependencies"}
            </Button>
          </div>
          {(isCreating || isUpdating || isDeleting) && (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-muted-foreground">
                {isCreating && "Creating task..."}
                {isUpdating && "Updating task..."}
                {isDeleting && "Deleting task..."}
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {showDependencyGraph && (
              <TaskDependencyGraph
                tasks={tasks.map((task) => ({
                  id: task.id,
                  name: task.title,
                  dependencies: task.dependencies || [],
                }))}
              />
            )}
            <div className="grid gap-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                task={task}
                                onUpdate={updateTask}
                                onDelete={deleteTask}
                                showDetails={showDetails}
                                isExpanded={expandedTasks.includes(task.id)}
                                onToggleExpand={() =>
                                  toggleTaskExpansion(task.id)
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onNextPage={prefetchNextPage}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No tasks found. Create one to get started.
          </div>
        )}

        <TaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={createTask}
          projectId={projectId}
        />
      </div>
    </ErrorBoundary>
  );
}
