"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
}

const columns = {
  todo: {
    title: "To Do",
    items: [] as Task[],
  },
  in_progress: {
    title: "In Progress",
    items: [] as Task[],
  },
  done: {
    title: "Done",
    items: [] as Task[],
  },
};

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [columns, setColumns] = useState(groupTasksByStatus(tasks));
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { addTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  function groupTasksByStatus(tasks: Task[]) {
    return {
      todo: {
        title: "To Do",
        items: tasks.filter((task) => task.status === "todo"),
      },
      in_progress: {
        title: "In Progress",
        items: tasks.filter((task) => task.status === "in_progress"),
      },
      done: {
        title: "Done",
        items: tasks.filter((task) => task.status === "done"),
      },
    };
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId as keyof typeof columns];
    const destColumn = columns[destination.droppableId as keyof typeof columns];
    const [removed] = sourceColumn.items.splice(source.index, 1);
    destColumn.items.splice(destination.index, 0, removed);

    setColumns({ ...columns });

    try {
      await updateTask(removed.id, {
        status: destination.droppableId,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleNewTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: "todo",
    };

    try {
      await addTask(taskData);
      setIsNewTaskOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleEditTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTask) return;

    const formData = new FormData(event.currentTarget);
    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    try {
      await updateTask(editingTask.id, updates);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <Button type="submit">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 mb-2 bg-white"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {task.description}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingTask(task)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={editingTask?.title}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                defaultValue={editingTask?.description}
                required
              />
            </div>
            <Button type="submit">Update Task</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
