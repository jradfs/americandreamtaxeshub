"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

const columns = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { addTask, updateTask, deleteTask } = useTasks();

  const { data: fetchedTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabaseBrowserClient
        .from("tasks")
        .select("*");
      if (error) throw error;
      return data as Task[];
    },
  });

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    await updateTask(draggableId, { status: newStatus });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided) => (
              <Card className="space-y-2">
                <CardHeader>
                  <CardTitle>{col.title}</CardTitle>
                </CardHeader>
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  <div className="space-y-2">
                    {tasks
                      .filter((task) => task.status === col.id)
                      .map((task, index) => (
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
                              className="p-3 border rounded hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">{task.title}</span>
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
