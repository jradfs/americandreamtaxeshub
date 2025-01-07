import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

// Define JSON field schemas
const stageSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  name: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  checklist: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
  })).nullable(),
}).nullable();

const triggerSchema = z.object({
  event: z.string(),
  condition: z.string().nullable(),
  action: z.string(),
  target: z.string().nullable(),
  parameters: z.record(z.string(), z.unknown()).nullable(),
  enabled: z.boolean().nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main workflow form schema
export const workflowFormSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Workflow name is required'),
  status: z.enum(['active', 'inactive', 'draft', 'archived'] as const satisfies readonly DbEnums['workflow_status']),
  type: z.enum(['tax_return', 'audit', 'advisory', 'bookkeeping', 'payroll', 'other'] as const satisfies readonly DbEnums['workflow_type']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  version: z.string().nullable(),
  template_id: z.string().uuid('Invalid template ID').nullable(),
  project_id: z.string().uuid('Invalid project ID').nullable(),
  client_id: z.string().uuid('Invalid client ID').nullable(),
  owner_id: z.string().uuid('Invalid owner ID').nullable(),
  team_id: z.string().uuid('Invalid team ID').nullable(),
  start_date: dateSchema,
  end_date: dateSchema,
  due_date: dateSchema,
  completion_date: dateSchema,
  estimated_duration: z.number().min(0).nullable(),
  actual_duration: z.number().min(0).nullable(),
  progress: z.number().min(0).max(100).nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  stages: z.array(stageSchema).nullable(),
  triggers: z.array(triggerSchema).nullable(),
  custom_fields: customFieldsSchema,
});

// Export types
export type WorkflowFormSchema = z.infer<typeof workflowFormSchema>;

// Validation helpers
export function validateWorkflowForm(data: unknown): { success: true; data: WorkflowFormSchema } | { success: false; error: z.ZodError } {
  const result = workflowFormSchema.safeParse(data);
  return result;
}

export function validateStages(data: unknown) {
  return z.array(stageSchema).safeParse(data);
}

export function validateTriggers(data: unknown) {
  return z.array(triggerSchema).safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<WorkflowFormSchema>): { success: true; data: WorkflowFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['name', 'status', 'type'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as WorkflowFormSchema
  };
} 