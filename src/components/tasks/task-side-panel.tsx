"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import type { Json } from "@/types/database.types";
import {
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  taskStatusOptions,
  taskPriorityOptions,
} from "@/types/tasks";
import { Database } from "@/types/database.types";
import { taskSchema } from "@/lib/validations/task";
import type { TaskFormSchema } from "@/lib/validations/task";

type ActivityLogEntry =
  Database["public"]["Tables"]["activity_log_entries"]["Insert"];

type TaskWithRelationsResponse =
  Database["public"]["Tables"]["tasks"]["Row"] & {
    assignee: {
      id: string;
      email: string;
      full_name: string;
      role: Database["public"]["Enums"]["user_role"];
    } | null;
    project: {
      id: string;
      name: string;
    } | null;
    parent_task: {
      id: string;
      title: string;
    } | null;
    activity_log_entries: Database["public"]["Tables"]["activity_log_entries"]["Row"][];
  };

type DbTask = Database["public"]["Tables"]["tasks"]["Row"];
type DbTaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type DbTaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

type FormData = TaskFormSchema;

interface TaskSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithRelations | null;
  projectId?: string;
  onTaskUpdate?: (task: TaskWithRelations) => void;
}

export function TaskSidePanel({
  isOpen,
  onClose,
  task,
  projectId,
  onTaskUpdate,
}: TaskSidePanelProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          project_id: task.project_id,
          assignee_id: task.assignee_id || undefined,
          status: (task.status as TaskStatus) || "todo",
          priority: (task.priority as TaskPriority) || "medium",
          due_date: task.due_date || null,
          start_date: task.start_date || null,
          checklist: {
            items:
              task.checklist_items?.map((item) => ({
                id: item.id,
                title: item.title,
                completed: item.completed,
                description: item.description || null,
                task_id: item.task_id,
              })) || null,
            completed_count:
              task.checklist_items?.filter((item) => item.completed).length ||
              0,
            total_count: task.checklist_items?.length || 0,
          },
          activity_log:
            task.activity_log_entries?.map((entry) => ({
              action: entry.action,
              timestamp: entry.created_at || "",
              user_id: entry.performed_by,
              details: entry.details?.toString() || "",
            })) || null,
          recurring_config: task.recurring_config,
        }
      : {
          title: "",
          description: "",
          project_id: "", // This should be provided by the parent component
          status: "todo" as TaskStatus,
          priority: "medium" as TaskPriority,
          due_date: null,
          start_date: null,
          checklist: null,
          activity_log: null,
          recurring_config: null,
        },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
        start_date: data.start_date,
        recurring_config: data.recurring_config,
        updated_at: new Date().toISOString(),
      } satisfies DbTaskUpdate;

      if (task?.id) {
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id);

        if (error) throw error;

        // Update checklist items
        if (data.checklist?.items) {
          const checklistItems = data.checklist.items.map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: task.id,
            updated_at: new Date().toISOString(),
          })) satisfies Database["public"]["Tables"]["checklist_items"]["Insert"][];

          const { error: checklistError } = await supabase
            .from("checklist_items")
            .upsert(checklistItems);

          if (checklistError) throw checklistError;
        }

        // Add activity log entry
        const { error: activityError } = await supabase
          .from("activity_log_entries")
          .insert({
            task_id: task.id,
            action: "updated",
            details: taskData,
            created_at: new Date().toISOString(),
          });

        if (activityError) throw activityError;
      } else {
        const insertData = {
          ...taskData,
          title: data.title, // Explicitly include required fields
          created_at: new Date().toISOString(),
        } satisfies DbTaskInsert;

        const { data: newTask, error } = await supabase
          .from("tasks")
          .insert([insertData])
          .select()
          .single();

        if (error) throw error;

        // Create checklist items
        if (data.checklist?.items && newTask) {
          const checklistItems = data.checklist.items.map((item) => ({
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: newTask.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })) satisfies Database["public"]["Tables"]["checklist_items"]["Insert"][];

          const { error: checklistError } = await supabase
            .from("checklist_items")
            .insert(checklistItems);

          if (checklistError) throw checklistError;
        }

        // Add initial activity log entry
        if (newTask) {
          const { error: activityError } = await supabase
            .from("activity_log_entries")
            .insert({
              task_id: newTask.id,
              action: "created",
              details: { status: newTask.status },
              created_at: new Date().toISOString(),
            });

          if (activityError) throw activityError;
        }
      }

      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{task ? "Edit Task" : "New Task"}</SheetTitle>
          <SheetDescription>
            {task
              ? "Update the task details below."
              : "Create a new task by filling out the form below."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <Form form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="status-label">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger aria-labelledby="status-label">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="priority-label">Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger aria-labelledby="priority-label">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskPriorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : task ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
