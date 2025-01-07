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
export const taskFormSchema = z.object({
  // Required fields
  title: z.string().min(1, 'Task title is required'),
  status: z.enum(['todo', 'in_progress', 'review', 'blocked', 'completed'] as const satisfies readonly DbEnums['task_status']),
  project_id: z.string().uuid('Invalid project ID'),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  type: z.enum(['preparation', 'review', 'filing', 'meeting', 'research', 'other'] as const satisfies readonly DbEnums['task_type']).nullable(),
  due_date: dateSchema,
  start_date: dateSchema,
  end_date: dateSchema,
  completion_date: dateSchema,
  estimated_hours: z.number().min(0).nullable(),
  actual_hours: z.number().min(0).nullable(),
  assigned_to: z.string().uuid('Invalid assignee ID').nullable(),
  reviewer_id: z.string().uuid('Invalid reviewer ID').nullable(),
  parent_task_id: z.string().uuid('Invalid parent task ID').nullable(),
  dependencies: z.array(z.string().uuid('Invalid task ID')).nullable(),
  blockers: z.array(z.string().uuid('Invalid task ID')).nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  order_index: z.number().min(0).nullable(),
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  time_tracking: timeTrackingSchema,
  checklist: checklistSchema,
  custom_fields: customFieldsSchema,
});

// Export types
export type TaskFormSchema = z.infer<typeof taskFormSchema>;

// Validation helpers
export function validateTaskForm(data: unknown): { success: true; data: TaskFormSchema } | { success: false; error: z.ZodError } {
  const result = taskFormSchema.safeParse(data);
  return result;
}

export function validateTimeTracking(data: unknown) {
  return timeTrackingSchema.safeParse(data);
}

export function validateChecklist(data: unknown) {
  return checklistSchema.safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<TaskFormSchema>): { success: true; data: TaskFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['title', 'status', 'project_id'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as TaskFormSchema
  };
}