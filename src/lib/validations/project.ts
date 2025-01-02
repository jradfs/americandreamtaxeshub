import { z } from 'zod';

const projectStatus = ['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled'] as const;
const priorityLevels = ['low', 'medium', 'high'] as const;
const serviceTypes = [
  'tax_return', 
  'accounting', 
  'payroll', 
  'business_services', 
  'irs_representation', 
  'consulting', 
  'uncategorized'
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
  assigned_to: z.string().optional()
}).refine(data => {
  // Validate assigned team member if specified
  return !data.assigned_to || data.assigned_to.length > 0;
}, {
  message: "Invalid team member assignment",
  path: ["assigned_to"]
});

export const projectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name is too long')
    .refine(name => name.trim().length > 0, 'Project name cannot be only whitespace'),
  description: z.string()
    .max(1000, 'Project description is too long')
    .optional(),
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
    .optional(),
  service_type: z.enum(serviceTypes).default('uncategorized'),
  template_id: z.string().optional(),
  tasks: z.array(taskSchema).optional(),
  team_members: z.array(z.string()).optional(),
  // Tax return specific fields
  tax_return_id: z.string().optional(),
  tax_return_status: z.enum(taxReturnStatus).optional(),
  // Accounting specific fields
  accounting_period: z.enum(accountingPeriod).optional(),
}).refine(data => {
  // Validate service-specific fields
  if (data.service_type === 'tax_return') {
    return data.tax_return_id !== undefined && data.tax_return_status !== undefined;
  }
  if (data.service_type === 'accounting') {
    return data.accounting_period !== undefined;
  }
  return true;
}, {
  message: "Service-specific fields are required",
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
}).refine(data => {
  // Validate team member assignments in tasks
  if (data.tasks && data.team_members) {
    const teamMemberSet = new Set(data.team_members);
    return data.tasks.every(task => 
      !task.assigned_to || teamMemberSet.has(task.assigned_to)
    );
  }
  return true;
}, {
  message: "Tasks can only be assigned to selected team members",
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
