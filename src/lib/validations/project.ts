import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

const currencySchema = z.number()
  .min(0, 'Amount must be non-negative')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places')
  .nullable();

// Define JSON field schemas
const budgetSchema = z.object({
  total: currencySchema,
  hourly_rate: currencySchema,
  estimated_hours: z.number().min(0).nullable(),
  max_hours: z.number().min(0).nullable(),
  billing_type: z.enum(['hourly', 'fixed', 'retainer']).nullable(),
  currency: z.string().length(3, 'Currency code must be 3 letters').nullable(),
  notes: z.string().nullable(),
}).nullable();

const timelineSchema = z.object({
  start_date: dateSchema,
  end_date: dateSchema,
  estimated_completion: dateSchema,
  actual_completion: dateSchema,
  milestones: z.array(z.object({
    title: z.string(),
    due_date: dateSchema,
    completed: z.boolean().nullable(),
    notes: z.string().nullable(),
  })).nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main project form schema
export const projectFormSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Project name is required'),
  status: z.enum(['active', 'completed', 'on_hold', 'cancelled'] as const satisfies readonly DbEnums['project_status']),
  client_id: z.string().uuid('Invalid client ID'),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  type: z.enum(['tax_return', 'audit', 'advisory', 'bookkeeping', 'payroll', 'other'] as const satisfies readonly DbEnums['project_type']).nullable(),
  due_date: dateSchema,
  start_date: dateSchema,
  end_date: dateSchema,
  completion_date: dateSchema,
  estimated_hours: z.number().min(0).nullable(),
  actual_hours: z.number().min(0).nullable(),
  assigned_team: z.array(z.string().uuid('Invalid team member ID')).nullable(),
  manager_id: z.string().uuid('Invalid manager ID').nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  billing_type: z.enum(['hourly', 'fixed', 'retainer']).nullable(),
  hourly_rate: currencySchema,
  fixed_price: currencySchema,
  retainer_amount: currencySchema,
  tax_year: z.number().min(1900).max(new Date().getFullYear() + 1).nullable(),
  filing_deadline: dateSchema,
  extension_deadline: dateSchema,
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  budget: budgetSchema,
  timeline: timelineSchema,
  custom_fields: customFieldsSchema,
});

// Export types
export type ProjectFormSchema = z.infer<typeof projectFormSchema>;

// Validation helpers
export function validateProjectForm(data: unknown): { success: true; data: ProjectFormSchema } | { success: false; error: z.ZodError } {
  const result = projectFormSchema.safeParse(data);
  return result;
}

export function validateBudget(data: unknown) {
  return budgetSchema.safeParse(data);
}

export function validateTimeline(data: unknown) {
  return timelineSchema.safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<ProjectFormSchema>): { success: true; data: ProjectFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['name', 'status', 'client_id'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as ProjectFormSchema
  };
}
