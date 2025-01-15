import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

// Main project form schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_id: z.string().uuid('Invalid client ID'),
  template_id: z.string().uuid('Invalid template ID').optional(),
  service_type: z.enum(['tax_return', 'bookkeeping', 'payroll', 'advisory']).nullable(),
  status: z.enum(['not_started', 'on_hold', 'cancelled', 'todo', 'in_progress', 'review', 'blocked', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date: z.string().datetime().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  tax_info: z.any().nullable(),
  accounting_info: z.any().nullable(),
  payroll_info: z.any().nullable(),
  service_info: z.any().nullable(),
  tax_return_id: z.string().uuid('Invalid tax return ID').nullable(),
  parent_project_id: z.string().uuid('Invalid parent project ID').nullable(),
  primary_manager: z.string().uuid('Invalid manager ID').nullable(),
  stage: z.string().nullable(),
  completed_tasks: z.number().nullable(),
  completion_percentage: z.number().nullable(),
  task_count: z.number().nullable(),
  template_tasks: z.array(z.custom<DbTaskInsert>()).optional(),
});

// Export types
export type ProjectFormSchema = z.infer<typeof projectSchema>;
export type ProjectFormValues = ProjectFormSchema;
export type ProjectFormData = ProjectFormSchema;

// Validation helpers
export function validateProjectForm(data: unknown): { success: true; data: ProjectFormSchema } | { success: false; error: z.ZodError } {
  const result = projectSchema.safeParse(data);
  return result;
}
