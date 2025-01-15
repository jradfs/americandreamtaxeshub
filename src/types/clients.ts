import type { Database } from './database.types'
import type { Json } from './database.types'
import { z } from 'zod'
import { clientFormSchema } from '@/lib/validations/client'

// Database types
export type DbClient = Database['public']['Tables']['clients']['Row']
export type DbClientInsert = Database['public']['Tables']['clients']['Insert']
export type DbClientUpdate = Database['public']['Tables']['clients']['Update']
export type DbClientContactDetails = Database['public']['Tables']['client_contact_details']['Row']

// Enums from database
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type FilingType = Database['public']['Enums']['filing_type']

export interface Dependent {
  name: string
  ssn?: string | null
  relationship?: string | null
  birth_date?: string | null
}

export interface PreviousReturn {
  year: number
  filed_date: string
  preparer?: string | null
  notes?: string | null
}

export interface TaxInfo {
  filing_status?: string | null
  tax_id?: string | null
  tax_year?: number | null
  last_filed_date?: string | null
  filing_type?: FilingType | null
  tax_id_type?: 'ssn' | 'ein' | null
  dependents?: Dependent[] | null
  previous_returns?: PreviousReturn[] | null
}

// Form data type that matches our schema
export type ClientFormData = z.infer<typeof clientFormSchema>

// Enhanced client type with relationships
export interface ClientWithRelations extends Omit<DbClient, 'tax_info'> {
  tax_info: TaxInfo | null
  contact_details?: DbClientContactDetails | null
  documents?: Database['public']['Tables']['client_documents']['Row'][]
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][]
  assigned_preparer?: Database['public']['Tables']['users']['Row'] | null
  tax_returns?: Database['public']['Tables']['tax_returns']['Row'][]
  projects?: Database['public']['Tables']['projects']['Row'][]
}

export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('filing_status' in value) || typeof value.filing_status === 'string' || value.filing_status === null) &&
    (!('tax_id' in value) || typeof value.tax_id === 'string' || value.tax_id === null) &&
    (!('tax_year' in value) || typeof value.tax_year === 'number' || value.tax_year === null)
}

export function isDbClient(client: unknown): client is DbClient {
  return client !== null &&
    typeof client === 'object' &&
    'id' in client &&
    'contact_email' in client &&
    'status' in client
}

// Conversion utilities
export function toClientFormData(client: DbClient): ClientFormData {
  const {
    created_at,
    updated_at,
    ...formData
  } = client
  
  const taxInfo = isTaxInfo(client.tax_info) ? client.tax_info : null

  return {
    ...formData,
    tax_info: taxInfo,
  } as ClientFormData
}

export function toDbClient(formData: ClientFormData): Omit<DbClientInsert, 'id'> {
  const {
    id, // Exclude id as it's handled by the database
    tax_info,
    ...rest
  } = formData

  // Ensure all required fields are present with defaults
  const dbClient: Omit<DbClientInsert, 'id'> = {
    ...rest,
    contact_email: rest.contact_email,
    status: rest.status,
    tax_info: tax_info as Json,
    // Add any other required fields with defaults
    type: rest.type || null,
    accounting_method: rest.accounting_method || null,
    business_type: rest.business_type || null,
    company_name: rest.company_name || null,
    document_deadline: rest.document_deadline || null,
    fiscal_year_end: rest.fiscal_year_end || null,
    industry_code: rest.industry_code || null,
    last_contact_date: rest.last_contact_date || null,
    last_filed_date: rest.last_filed_date || null,
    next_appointment: rest.next_appointment || null,
    primary_contact_name: rest.primary_contact_name || null,
    tax_id: rest.tax_id || null,
    tax_return_status: rest.tax_return_status || null,
    user_id: rest.user_id || null,
    assigned_preparer_id: rest.assigned_preparer_id || null,
  }

  return dbClient
}

// Constants
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ClientStatus>

export const CLIENT_TYPE = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const satisfies Record<string, ClientType>

// Helper functions for type checking
export function isValidClientStatus(status: string): status is ClientStatus {
  return Object.values(CLIENT_STATUS).includes(status as ClientStatus)
}

export function isValidClientType(type: string): type is ClientType {
  return Object.values(CLIENT_TYPE).includes(type as ClientType)
}

// Helper function for null safety
export function ensureNullable<T>(value: T | undefined): T | null {
  return value === undefined ? null : value
}