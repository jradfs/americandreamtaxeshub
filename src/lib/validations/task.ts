import { z } from "zod";
import {
  TaskStatus,
  TaskPriority,
  taskStatusOptions,
  taskPriorityOptions,
} from "@/types/tasks";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().nullable().optional(),
  status: z.enum(taskStatusOptions),
  priority: z.enum(taskPriorityOptions).nullable().optional(),
  project_id: z.string().uuid("Invalid project ID").nullable().optional(),
  assignee_id: z.string().uuid("Invalid assignee ID").nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  tax_form_type: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ["in_progress", "review"],
  in_progress: ["todo", "review", "completed"],
  review: ["in_progress", "completed"],
  completed: ["review"],
} as const;

// Utility type for valid status transitions
export type ValidStatusTransition<T extends TaskStatus> =
  (typeof taskStatusTransitions)[T][number];
