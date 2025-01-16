"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2 } from "lucide-react";
import { format } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "./TaskForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: string;
  dueDate: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  onStatusChange?: (id: string, newStatus: string) => void;
}

export function TaskCard({
  id,
  title,
  description,
  priority,
  status,
  dueDate,
  assignedTo,
  onStatusChange,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useTasks();

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleEdit = async (formData: any) => {
    try {
      await updateTask(id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        className="p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge className={priorityColors[priority]}>{priority}</Badge>
        </div>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4" />
          <span>{format(new Date(dueDate), "MMM d, yyyy")}</span>
        </div>

        {assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User2 className="h-4 w-4" />
            <span>{assignedTo.name}</span>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TaskForm
                initialData={{
                  id,
                  title,
                  description,
                  priority,
                  status,
                  dueDate,
                  assignedTo: assignedTo?.id,
                }}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
}
