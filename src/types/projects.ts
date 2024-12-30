import { Database } from "./database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type NewProject = Database["public"]["Tables"]["projects"]["Insert"];

export type ServiceType = 
  | 'tax_returns'
  | 'accounting'
  | 'payroll'
  | 'business_services'
  | 'irs_representation'
  | 'consulting'
  | 'uncategorized';

export type TaxReturnType = 
  | '1040'
  | '1120'
  | '1065'
  | '1120S'
  | '990'
  | '941'
  | '940'
  | 'other';

export type ReviewStatus =
  | 'not_started'
  | 'in_progress'
  | 'needs_review'
  | 'reviewed'
  | 'approved'
  | 'rejected';

export interface TaxInfo {
  return_type: TaxReturnType;
  tax_year: number;
  filing_deadline?: string;
  extension_filed?: boolean;
  missing_documents?: string[];
  review_status?: ReviewStatus;
  reviewer_id?: string;
  review_notes?: string;
  estimated_refund?: number;
  estimated_balance_due?: number;
  payment_status?: 'pending' | 'partial' | 'paid' | 'overdue';
  estimated_tax_payments?: Record<string, boolean>;
}

export interface AccountingInfo {
  service_type: 'bookkeeping' | 'financial_statements' | 'audit' | 'other';
  period_start?: string;
  period_end?: string;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  software_used?: string;
  last_reconciliation_date?: string;
}

export interface PayrollInfo {
  frequency: 'weekly' | 'bi_weekly' | 'semi_monthly' | 'monthly';
  next_payroll_date?: string;
  employee_count?: number;
  last_payroll_run?: string;
  tax_deposits_current?: boolean;
  software_used?: string;
}

export interface BusinessServicesInfo {
  service_type: 'business_formation' | 'licensing' | 'compliance' | 'other';
  due_date?: string;
  state?: string;
  entity_type?: string;
  status?: string;
}

export interface IRSNoticeInfo {
  notice_type: string;
  notice_date: string;
  response_deadline: string;
  tax_year?: number;
  amount_due?: number;
  status: 'new' | 'in_progress' | 'responded' | 'resolved';
}

export interface ConsultingInfo {
  topic: string;
  scheduled_date?: string;
  duration?: number;
  follow_up_needed?: boolean;
  notes?: string;
}

export interface Client {
  id: string;
  full_name: string | null;
  company_name: string | null;
  contact_email: string;
  contact_info: any;
  status: string;
  tax_info: any;
  type: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id: string;
  status: 'not_started' | 'in_progress' | 'waiting_for_info' | 'needs_review' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  service_type: ServiceType;
  tax_info?: TaxInfo;
  accounting_info?: AccountingInfo;
  payroll_info?: PayrollInfo;
  business_services_info?: BusinessServicesInfo;
  irs_notice_info?: IRSNoticeInfo;
  consulting_info?: ConsultingInfo;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithRelations extends Project {
  client?: Client;
  tasks?: Task[];
}

export interface ProjectFormValues {
  name: string;
  description: string | null;
  client_id: string | null;
  status: 'not_started' | 'in_progress' | 'waiting_for_info' | 'needs_review' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  service_type: ServiceType;
  tax_info?: TaxInfo;
  accounting_info?: AccountingInfo;
  payroll_info?: PayrollInfo;
  business_services_info?: BusinessServicesInfo;
  irs_notice_info?: IRSNoticeInfo;
  consulting_info?: ConsultingInfo;
}