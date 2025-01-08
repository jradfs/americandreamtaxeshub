import { z } from 'zod'
import type { Database } from '@/types/database.types'

type DbEnums = Database['public']['Enums']

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

const timeSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
  .nullable();

// Define JSON field schemas
const timeTrackingSchema = z.object({
  estimated_hours: z.number().min(0).nullable(),
  actual_hours: z.number().min(0).nullable(),
  start_time: timeSchema,
  end_time: timeSchema,
  breaks: z.array(z.object({
    start_time: timeSchema,
    end_time: timeSchema,
    duration: z.number().min(0).nullable(),
  })).nullable(),
  total_duration: z.number().min(0).nullable(),
  billable: z.boolean().nullable(),
  notes: z.string().nullable(),
}).nullable();

const checklistSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid('Invalid UUID format'),
    title: z.string(),
    completed: z.boolean(),
    due_date: dateSchema,
    assigned_to: z.string().uuid('Invalid UUID format').nullable(),
    notes: z.string().nullable(),
  })).nullable(),
  completed_count: z.number().min(0).nullable(),
  total_count: z.number().min(0).nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main task form schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  project_id: z.string().uuid('Invalid project ID'),
  assignee_id: z.string().uuid('Invalid assignee ID').optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'blocked', 'completed'] as const satisfies readonly DbEnums['task_status']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date: dateSchema,
  start_date: dateSchema,
  checklist: checklistSchema,
  activity_log: z.array(z.object({
    action: z.string(),
    timestamp: z.string(),
    user_id: z.string().optional(),
    details: z.string().optional()
  })).nullable(),
  recurring_config: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().min(1),
    end_date: dateSchema,
    days_of_week: z.array(z.number().min(0).max(6)).optional(),
    day_of_month: z.number().min(1).max(31).optional(),
    month: z.number().min(1).max(12).optional()
  }).nullable()
});

// Export types
export type TaskFormSchema = z.infer<typeof taskSchema>;

// Validation helpers
export function validateTaskForm(data: unknown): { success: true; data: TaskFormSchema } | { success: false; error: z.ZodError } {
  const result = taskSchema.safeParse(data);
  return result;
}