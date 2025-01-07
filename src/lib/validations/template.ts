import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

// Define JSON field schemas
const taskTemplateSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  title: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  dependencies: z.array(z.string().uuid('Invalid UUID format')).nullable(),
  checklist: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
  })).nullable(),
}).nullable();

const workflowTemplateSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  name: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  stages: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
    tasks: z.array(taskTemplateSchema).nullable(),
  })).nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main template form schema
export const templateFormSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Template name is required'),
  status: z.enum(['active', 'inactive', 'draft', 'archived'] as const satisfies readonly DbEnums['template_status']),
  type: z.enum(['project', 'task', 'workflow', 'document', 'email', 'other'] as const satisfies readonly DbEnums['template_type']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  version: z.string().nullable(),
  category: z.string().nullable(),
  owner_id: z.string().uuid('Invalid owner ID').nullable(),
  team_id: z.string().uuid('Invalid team ID').nullable(),
  parent_template_id: z.string().uuid('Invalid parent template ID').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  task_templates: z.array(taskTemplateSchema).nullable(),
  workflow_templates: z.array(workflowTemplateSchema).nullable(),
  custom_fields: customFieldsSchema,
});

// Export types
export type TemplateFormSchema = z.infer<typeof templateFormSchema>;

// Validation helpers
export function validateTemplateForm(data: unknown): { success: true; data: TemplateFormSchema } | { success: false; error: z.ZodError } {
  const result = templateFormSchema.safeParse(data);
  return result;
}

export function validateTaskTemplates(data: unknown) {
  return z.array(taskTemplateSchema).safeParse(data);
}

export function validateWorkflowTemplates(data: unknown) {
  return z.array(workflowTemplateSchema).safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<TemplateFormSchema>): { success: true; data: TemplateFormSchema } | { success: false; error: string[] } {
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
    data: data as TemplateFormSchema
  };
} 