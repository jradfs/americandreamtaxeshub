import { Database } from './database.types'
import type { Json } from './database.types'
import { Task } from './tasks'
import { User } from './hooks'

// Base types from database
export type Project = Database['public']['Tables']['projects']['Row']
export type NewProject = Database['public']['Tables']['projects']['Insert']
export type UpdateProject = Database['public']['Tables']['projects']['Update']
export type ServiceType = Database['public']['Tables']['projects']['Row']['service_type']

// Enum types
export type ServiceCategory = Database['public']['Enums']['service_type']

export type TaxReturnType = Database['public']['Enums']['tax_return_type']
/**
 * Represents the lifecycle status of a project
 * 
 * - not_started: Project has been created but work hasn't started
 * - on_hold: Project is temporarily paused
 * - cancelled: Project has been cancelled
 * - todo: Project is ready to start
 * - in_progress: Work is actively being done on the project
 * - review: Project is under review
 * - blocked: Project is blocked waiting on external dependencies
 * - completed: Project work is finished
 * - archived: Project is archived for historical purposes
 */
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type ReviewStatus = Database['public']['Enums']['review_status']
export type Priority = Database['public']['Enums']['priority_level']

// Project metadata interface
export interface ProjectMetadata {
  readonly id: string
  readonly created_at: string
  readonly updated_at: string
  version: number
  archived: boolean
}

// Base project interface
export interface ProjectBase extends ProjectMetadata {
  title: string
  description?: string
  status: ProjectStatus
  priority: Priority
  due_date?: string
  assigned_to?: string[]
  tags?: string[]
  category: ServiceCategory
  client_id: string
  team_members?: string[]
}

// Service-specific information interfaces
export interface TaxInfo {
  return_type: TaxReturnType
  tax_year: number
  filing_deadline?: string
  extension_filed?: boolean
  extension_deadline?: string
  estimated_refund?: number
  estimated_liability?: number
  prior_year_comparison?: boolean
  missing_documents?: string[]
  review_status?: ReviewStatus
  reviewer_id?: string
  review_notes?: string
  payment_status?: 'pending' | 'partial' | 'paid' | 'overdue'
  estimated_tax_payments?: Record<string, boolean>
  state_returns?: Array<{
    state: string
    status: string
    due_date?: string
    extension_filed?: boolean
  }>
}

export interface AccountingInfo {
  service_type: 'bookkeeping' | 'financial_statements' | 'audit' | 'other'
  period_start?: string
  period_end?: string
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time'
  software_used?: string
  last_reconciliation_date?: string
  chart_of_accounts_setup?: boolean
  bank_accounts_connected?: boolean
  credit_cards_connected?: boolean
}

export interface PayrollInfo {
  frequency: 'weekly' | 'bi_weekly' | 'semi_monthly' | 'monthly'
  next_payroll_date?: string
  employee_count?: number
  last_payroll_run?: string
  tax_deposits_current?: boolean
  software_used?: string
  state_registrations?: string[]
  workers_comp_setup?: boolean
  benefits_setup?: boolean
}

export interface BusinessServicesInfo {
  service_type: 'business_formation' | 'licensing' | 'compliance' | 'other'
  due_date?: string
  state?: string
  entity_type?: string
  filing_requirements?: string[]
  compliance_deadlines?: string[]
}

export interface IRSNoticeInfo {
  notice_type: string
  notice_date: string
  response_deadline: string
  tax_year?: number
  amount_due?: number
  status: 'new' | 'in_progress' | 'responded' | 'resolved'
  assigned_to?: string
  response_strategy?: string
  documents_needed?: string[]
}

export interface ConsultingInfo {
  topic: string
  scheduled_date?: string
  duration?: number
  follow_up_needed?: boolean
  notes?: string
  attendees?: string[]
  materials_prepared?: boolean
  follow_up_date?: string
}

// Client and related interfaces
/**
 * Represents a client in the system
 * 
 * @property {string} id - Unique identifier for the client
 * @property {string} contact_email - Primary contact email address
 * @property {string | null} full_name - Full name of the client (individual)
 * @property {string | null} company_name - Company name (if business client)
 * @property {string | null} business_tax_id - Business tax ID (EIN)
 * @property {string | null} individual_tax_id - Individual tax ID (SSN)
 * @property {Json} contact_info - Additional contact information
 * @property {string | null} created_at - Timestamp when client was created
 * @property {string | null} updated_at - Timestamp of last update
 * @property {string | null} user_id - Associated user account ID
 * @property {'active' | 'inactive' | 'pending' | 'archived'} status - Current status
 * @property {'business' | 'individual' | null} type - Client type
 * @property {Json} tax_info - Additional tax-related information
 */
export interface Client {
  id: string;
  contact_email: string;
  full_name: string | null;
  company_name: string | null;
  business_tax_id: string | null;
  individual_tax_id: string | null;
  contact_info: Json;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  type: 'business' | 'individual' | null;
  tax_info: Json;
}

export interface Owner {
  id: string
  client_id: string
  full_name: string
  ownership_percentage: number
  tax_id?: string
  contact_info?: Json
}

export interface Document {
  id: string
  name: string
  type: string
  path: string
  uploaded_by: string
  upload_date: string
  metadata?: Json
}

// Project with all relations
/**
 * Represents service-specific information for a project
 * 
 * @property {ServiceCategory} type - The category of service being provided
 * @property {TaxInfo | AccountingInfo | PayrollInfo | BusinessServicesInfo | IRSNoticeInfo | ConsultingInfo} info - Service-specific details
 */
export type ServiceInfo = {
  type: ServiceCategory
  info: TaxInfo | AccountingInfo | PayrollInfo | BusinessServicesInfo | IRSNoticeInfo | ConsultingInfo
  created_at?: string
  updated_at?: string
  version?: number
}

export interface ProjectWithRelations extends Project {
  client?: Client | null
  primary_manager?: {
    id: string
    full_name: string
    email: string
  } | null
  tasks?: (Omit<Database['public']['Tables']['tasks']['Row'], 'status'> & {
    status: Database['public']['Enums']['task_status'] | string
    priority?: Database['public']['Enums']['task_priority'] | string | null
    category?: Database['public']['Enums']['service_type'] | string | null
    assigned_team?: Array<{
      id: string
      full_name: string
      email: string
    }>
  })[]
  tax_return?: Database['public']['Tables']['tax_returns']['Row'] | null
  service_info?: ServiceInfo & {
    metadata?: Json
    audit_log?: Json
  }
}

export interface Note {
  id: string
  project_id: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  visibility: 'internal' | 'client' | 'private'
}

export interface TimeEntry {
  id: string
  project_id: string
  user_id: string
  task_id?: string
  duration: number
  description: string
  billable: boolean
  date: string
  created_at: string
  updated_at: string
}

// View and filter types
export interface ProjectView {
  id: string
  name: string
  filters: ProjectFilters
  layout: 'list' | 'grid' | 'calendar'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProjectFilters {
  search?: string
  service?: ServiceCategory[]
  status?: ProjectStatus[]
  priority?: Priority[]
  dateRange?: {
    start: Date
    end: Date
  }
  clientId?: string
  stage?: string
  isArchived?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
  missingInfo?: boolean
  needsReview?: boolean
  readyToFile?: boolean
  returnType?: TaxReturnType[]
  reviewStatus?: ReviewStatus[]
  teamMemberId?: string
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
  view?: ProjectView
}
