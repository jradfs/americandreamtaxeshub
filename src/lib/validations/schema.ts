import { z } from 'zod'
import { 
  CLIENT_STATUS, 
  CLIENT_TYPE, 
  FILING_TYPE 
} from '@/types/clients'
import {
  PROJECT_STATUS,
  SERVICE_TYPE
} from '@/types/projects'
import {
  TASK_STATUS,
  TASK_PRIORITY
} from '@/types/tasks'

// Client Schemas
export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  alternate_email: z.string().email().optional(),
  alternate_phone: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone']).optional(),
  notes: z.string().optional()
})

export const taxInfoSchema = z.object({
  filing_type: z.enum(FILING_TYPE),
  tax_id_type: z.enum(['ssn', 'ein']).optional(),
  tax_id: z.string().optional(),
  filing_status: z.string().optional(),
  dependents: z.array(z.object({
    name: z.string(),
    ssn: z.string().optional(),
    relationship: z.string().optional(),
    birth_date: z.string().optional()
  })).optional(),
  previous_returns: z.array(z.object({
    year: z.number(),
    filed_date: z.string(),
    preparer: z.string().optional(),
    notes: z.string().optional()
  })).optional()
})

export const clientSchema = z.object({
  contact_email: z.string().email(),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  status: z.enum(CLIENT_STATUS),
  type: z.enum(CLIENT_TYPE),
  contact_info: contactInfoSchema,
  tax_info: taxInfoSchema.nullable(),
  business_tax_id: z.string().optional(),
  individual_tax_id: z.string().optional()
})

// Project Schemas
export const projectTaxInfoSchema = z.object({
  return_type: z.enum(FILING_TYPE),
  tax_year: z.number(),
  filing_status: z.string().optional(),
  is_extension_filed: z.boolean().optional(),
  extension_date: z.string().optional(),
  documents_received: z.boolean().optional(),
  last_filed_date: z.string().optional()
})

export const accountingInfoSchema = z.object({
  fiscal_year_end: z.string().optional(),
  accounting_method: z.enum(['cash', 'accrual']).optional(),
  last_reconciliation_date: z.string().optional(),
  software: z.string().optional(),
  chart_of_accounts_setup: z.boolean().optional(),
  notes: z.string().optional()
})

export const payrollInfoSchema = z.object({
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly']).optional(),
  employee_count: z.number().optional(),
  last_payroll_date: z.string().optional(),
  next_payroll_date: z.string().optional(),
  tax_deposit_schedule: z.enum(['monthly', 'semi-weekly']).optional(),
  notes: z.string().optional()
})

export const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUS),
  service_type: z.enum(SERVICE_TYPE),
  client_id: z.string().optional(),
  primary_manager: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  end_date: z.string().optional(),
  tax_info: projectTaxInfoSchema.nullable(),
  accounting_info: accountingInfoSchema.nullable(),
  payroll_info: payrollInfoSchema.nullable(),
  service_info: z.record(z.unknown()).nullable()
})

// Task Schemas
export const taskChecklistSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    added_by: z.string().optional(),
    added_at: z.string().optional()
  }))
})

export const taskRecurringConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number(),
  end_date: z.string().optional(),
  end_occurrences: z.number().optional()
})

export const taskActivityLogSchema = z.object({
  entries: z.array(z.object({
    id: z.string(),
    type: z.enum(['status_change', 'assignment', 'comment', 'checklist_update']),
    user_id: z.string(),
    timestamp: z.string(),
    details: z.record(z.unknown())
  }))
})

export const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(TASK_STATUS),
  priority: z.enum(TASK_PRIORITY).optional(),
  project_id: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  start_date: z.string().optional(),
  progress: z.number().optional(),
  checklist: taskChecklistSchema.nullable(),
  recurring_config: taskRecurringConfigSchema.nullable(),
  activity_log: taskActivityLogSchema.nullable(),
  parent_task_id: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional()
}) 