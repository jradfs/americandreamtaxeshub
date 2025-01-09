import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

const emailSchema = z.string()
  .email('Invalid email address')
  .nullable();

const phoneSchema = z.string()
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .nullable();

const zipSchema = z.string()
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
  .nullable();

// Define JSON field schemas
const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().length(2, 'State should be a 2-letter code').nullable(),
  zip: zipSchema,
  alternate_email: emailSchema,
  alternate_phone: phoneSchema,
  preferred_contact_method: z.enum(['email', 'phone']).nullable(),
  notes: z.string().nullable(),
}).nullable();

const dependentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format').nullable(),
  relationship: z.string().nullable(),
  birth_date: dateSchema,
});

const previousReturnSchema = z.object({
  year: z.number().min(1900).max(new Date().getFullYear()),
  filed_date: dateSchema,
  preparer: z.string().nullable(),
  notes: z.string().nullable(),
});

const taxInfoSchema = z.object({
  filing_status: z.string().nullable(),
  tax_id: z.string().nullable(),
  tax_year: z.number().min(1900).max(new Date().getFullYear() + 1).nullable(),
  last_filed_date: dateSchema,
  filing_type: z.enum(['individual', 'business', 'partnership', 'corporation', 's_corporation', 'non_profit'] as const satisfies readonly DbEnums['filing_type']).nullable(),
  tax_id_type: z.enum(['ssn', 'ein']).nullable(),
  dependents: z.array(dependentSchema).nullable(),
  previous_returns: z.array(previousReturnSchema).nullable(),
}).nullable();

// Main client form schema
export const clientFormSchema = z.object({
  // Required fields
  contact_email: z.string().email('Invalid contact email'),
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['client_status']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  full_name: z.string().min(1, 'Full name is required').nullable(),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().length(2, 'State should be a 2-letter code').nullable(),
  zip: zipSchema,
  company_name: z.string().nullable(),
  business_type: z.string().nullable(),
  tax_id: z.string().nullable(),
  notes: z.string().nullable(),
  onboarding_notes: z.string().nullable(),
  business_tax_id: z.string().regex(/^\d{2}-?\d{7}$/, 'Invalid EIN format').nullable(),
  individual_tax_id: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format').nullable(),
  industry_code: z.string().regex(/^\d{6}$/, 'Invalid NAICS code format').nullable(),
  fiscal_year_end: dateSchema,
  accounting_method: z.enum(['cash', 'accrual']).nullable(),
  document_deadline: dateSchema,
  last_contact_date: dateSchema,
  last_filed_date: dateSchema,
  next_appointment: dateSchema,
  primary_contact_name: z.string().nullable(),
  assigned_preparer_id: z.string().uuid('Invalid UUID format').nullable(),
  user_id: z.string().uuid('Invalid UUID format').nullable(),
  tax_return_status: z.string().nullable(),
  type: z.enum(['business', 'individual'] as const satisfies readonly DbEnums['client_type']).nullable(),
  
  // JSON fields
  contact_details: z.object({
    phone: phoneSchema,
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().length(2, 'State should be a 2-letter code').nullable(),
    zip: zipSchema,
  }).nullable(),
  tax_info: taxInfoSchema,
});

// Export types
export type ClientFormSchema = z.infer<typeof clientFormSchema>;

// Validation helpers
export function validateClientForm(data: unknown): { success: true; data: ClientFormSchema } | { success: false; error: z.ZodError } {
  const result = clientFormSchema.safeParse(data);
  return result;
}

export function validateContactInfo(data: unknown) {
  return contactInfoSchema.safeParse(data);
}

export function validateTaxInfo(data: unknown) {
  return taxInfoSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<ClientFormSchema>): { success: true; data: ClientFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['contact_email', 'status'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as ClientFormSchema
  };
} 