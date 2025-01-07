import { Database } from './database.types';
import type { Json } from './database.types';
import { z } from 'zod';
import { projectSchema } from '@/lib/validations/project';

// Database types
export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Enums from database
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type ServiceType = Database['public']['Enums']['service_type'];
export type TaskPriority = Database['public']['Enums']['task_priority'];

// Strongly typed JSON fields
export interface TaxInfo {
  return_type?: Database['public']['Enums']['filing_type']
  filing_status?: string
  tax_year?: number
  due_date?: string
  extension_date?: string
  estimated_refund?: number
  estimated_liability?: number
  notes?: string
}

export interface AccountingInfo {
  period_start?: string
  period_end?: string
  accounting_method?: 'cash' | 'accrual'
  fiscal_year_end?: string
  last_reconciliation_date?: string
  chart_of_accounts_setup?: boolean
  software_used?: string
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

export interface PayrollInfo {
  payroll_schedule?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
  employee_count?: number
  last_payroll_date?: string
  next_payroll_date?: string
  payroll_provider?: string
  notes?: string
}

export interface ServiceInfo {
  service_category?: string
  frequency?: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  last_service_date?: string
  next_service_date?: string
  special_instructions?: string
  notes?: string
}

// Form data type that matches our schema
export type ProjectFormData = z.infer<typeof projectSchema>;

// Enhanced project type with relationships and strongly typed JSON fields
export interface ProjectWithRelations extends Omit<DbProject, 'tax_info' | 'accounting_info' | 'payroll_info' | 'service_info'> {
  tax_info: TaxInfo | null
  accounting_info: AccountingInfo | null
  payroll_info: PayrollInfo | null
  service_info: ServiceInfo | null
  client?: Database['public']['Tables']['clients']['Row'] | null
  template?: Database['public']['Tables']['project_templates']['Row'] | null
  tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_members?: Database['public']['Tables']['project_team_members']['Row'][]
  primary_manager_details?: Database['public']['Tables']['users']['Row'] | null
}

// Type guards
export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('tax_year' in value) || typeof value.tax_year === 'number') &&
    (!('estimated_refund' in value) || typeof value.estimated_refund === 'number') &&
    (!('estimated_liability' in value) || typeof value.estimated_liability === 'number')
}

export function isAccountingInfo(value: unknown): value is AccountingInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('chart_of_accounts_setup' in value) || typeof value.chart_of_accounts_setup === 'boolean') &&
    (!('accounting_method' in value) || ['cash', 'accrual'].includes(value.accounting_method as string))
}

export function isPayrollInfo(value: unknown): value is PayrollInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('employee_count' in value) || typeof value.employee_count === 'number') &&
    (!('payroll_schedule' in value) || ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'].includes(value.payroll_schedule as string))
}

export function isServiceInfo(value: unknown): value is ServiceInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('frequency' in value) || ['one-time', 'weekly', 'monthly', 'quarterly', 'annually'].includes(value.frequency as string))
}

export function isDbProject(project: unknown): project is DbProject {
  return project !== null &&
    typeof project === 'object' &&
    'id' in project &&
    'name' in project &&
    'status' in project
}

// Conversion utilities
export function toProjectFormData(project: DbProject): Omit<ProjectFormData, 'service_type' | 'priority'> & {
  service_type?: ServiceType | null
  priority?: TaskPriority | null
} {
  const {
    id,
    created_at,
    updated_at,
    priority,
    service_type,
    ...formData
  } = project
  
  return {
    ...formData,
    priority: priority as TaskPriority,
    service_type: service_type as ServiceType,
    tax_info: isTaxInfo(project.tax_info) ? project.tax_info : null,
    accounting_info: isAccountingInfo(project.accounting_info) ? project.accounting_info : null,
    payroll_info: isPayrollInfo(project.payroll_info) ? project.payroll_info : null,
    service_info: isServiceInfo(project.service_info) ? project.service_info : null,
  }
}

export function toDbProject(formData: ProjectFormData): DbProjectInsert {
  const {
    tax_info,
    accounting_info,
    payroll_info,
    service_info,
    ...rest
  } = formData

  return {
    ...rest,
    name: rest.name || '',
    status: rest.status || 'not_started',
    tax_info: tax_info as Json,
    accounting_info: accounting_info as Json,
    payroll_info: payroll_info as Json,
    service_info: service_info as Json,
  }
}

// Constants
export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ProjectStatus>

export const SERVICE_TYPE = {
  TAX_RETURN: 'tax_return',
  BOOKKEEPING: 'bookkeeping',
  PAYROLL: 'payroll',
  ADVISORY: 'advisory',
} as const satisfies Record<string, ServiceType>

// Helper functions for type checking
export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(status as ProjectStatus)
}

export function isValidServiceType(type: string): type is ServiceType {
  return Object.values(SERVICE_TYPE).includes(type as ServiceType)
}
