import { z } from 'zod';

const projectStatus = ['not_started', 'in_progress', 'on_hold', 'completed', 'cancelled'] as const;
const priorityLevels = ['low', 'medium', 'high', 'urgent'] as const;
const serviceTypes = [
  'tax_return', 
  'accounting', 
  'payroll', 
  'tax_planning', 
  'compliance'
] as const;

const taxReturnStatus = [
  'not_started',
  'in_progress',
  'review_needed',
  'completed'
] as const;

const accountingPeriod = [
  'monthly',
  'quarterly',
  'annual'
] as const;

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Task title is too long'),
  description: z.string().max(500, 'Task description is too long').optional(),
  priority: z.enum(priorityLevels).default('medium'),
  dependencies: z.array(z.string()).optional(),
  order_index: z.number().optional(),
  assignee_id: z.string().optional()
}).refine(data => {
  // Validate assigned team member if specified
  return !data.assignee_id || data.assignee_id.length > 0;
}, {
  message: "Invalid team member assignment",
  path: ["assignee_id"]
});

export const projectSchema = z.object({
  creation_type: z.enum(['template', 'custom']),
  template_id: z.string().optional().nullable(),
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name is too long')
    .refine(name => name.trim().length > 0, 'Project name cannot be only whitespace'),
  description: z.string()
    .max(1000, 'Project description is too long')
    .optional().nullable(),
  client_id: z.string().min(1, 'Client is required'),
  status: z.enum(projectStatus).default('not_started'),
  priority: z.enum(priorityLevels).default('medium'),
  due_date: z.date()
    .refine(date => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, {
      message: 'Due date must not be in the past'
    })
    .optional().nullable(),
  service_type: z.enum(serviceTypes).default('tax_return'),
  tax_info: z.record(z.unknown()).optional().nullable(),
  accounting_info: z.record(z.unknown()).optional().nullable(),
  payroll_info: z.record(z.unknown()).optional().nullable(),
  tasks: z.array(taskSchema).optional(),
  team_members: z.array(z.string()).optional(),
  tax_return_id: z.number().optional().nullable(),
}).refine(data => {
  // If creation type is template, template_id must be provided
  if (data.creation_type === 'template' && !data.template_id) {
    return false;
  }
  return true;
}, {
  message: 'Please select a template',
  path: ['template_id']
}).refine(data => {
  // Validate service-specific fields
  if (data.service_type === 'tax_return') {
    return data.tax_info !== undefined;
  }
  if (data.service_type === 'accounting') {
    return data.accounting_info !== undefined;
  }
  if (data.service_type === 'payroll') {
    return data.payroll_info !== undefined;
  }
  return true;
}, {
  message: "Service-specific information is required",
  path: ["service_type"]
}).refine(data => {
  // Validate template and tasks
  if (data.template_id && (!data.tasks?.length || data.tasks.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Template tasks are required when using a template",
  path: ["tasks"]
}).refine(data => {
  // Validate task titles and dependencies
  if (data.tasks) {
    const taskTitles = new Set();
    for (const task of data.tasks) {
      if (taskTitles.has(task.title)) {
        return false;
      }
      taskTitles.add(task.title);
    }
    // Validate task dependencies
    for (const task of data.tasks) {
      if (task.dependencies) {
        for (const dep of task.dependencies) {
          if (!taskTitles.has(dep)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}, {
  message: "Tasks must have unique titles and valid dependencies",
  path: ["tasks"]
});

// Helper function to validate task dependencies
export function validateTaskDependencies(tasks: z.infer<typeof taskSchema>[]): boolean {
  const taskTitles = new Set(tasks.map(t => t.title));
  return tasks.every(task => 
    !task.dependencies?.length || 
    task.dependencies.every(dep => taskTitles.has(dep))
  );
}

export type ProjectStatus = typeof projectStatus[number];
export type PriorityLevel = typeof priorityLevels[number];
export type ServiceType = typeof serviceTypes[number];
export type TaxReturnStatus = typeof taxReturnStatus[number];
export type AccountingPeriod = typeof accountingPeriod[number];
export type TaskSchema = z.infer<typeof taskSchema>;
export type ProjectFormValues = z.infer<typeof projectSchema>;
