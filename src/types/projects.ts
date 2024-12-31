import { Database, Tables } from "./database";

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

export type ProjectStatus = 
  | 'not_started'      // Initial state
  | 'in_progress'      // Work has begun
  | 'waiting_for_info' // Blocked on client input
  | 'needs_review'     // Ready for internal review
  | 'completed'        // Work is done
  | 'archived';        // Project is archived

export type ReviewStatus =
  | 'not_started'      // Review not started
  | 'in_progress'      // Under review
  | 'needs_revision'   // Changes requested
  | 'approved'         // Review passed
  | 'rejected';        // Review failed

export type TaskStatus =
  | 'not_started'      // Task not started
  | 'in_progress'      // Task being worked on
  | 'blocked'          // Task is blocked
  | 'completed';       // Task is done

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
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
}


export interface ProjectWithRelations extends Project {
  client?: Client;
  tasks?: Task[];
}

export type ProjectTemplate = Tables<'project_templates'> & {
  tasks?: Tables<'template_tasks'>[];
};

export interface ProjectFormValues {
  name: string;
  description: string | null;
  client_id: string | null;
  status: Database['public']['Enums']['project_status'];
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  service_type: ServiceType;
  tax_info?: Json | null;
  accounting_info?: Json | null;
  payroll_info?: Json | null;
  business_services_info?: Json | null;
  irs_notice_info?: Json | null;
  consulting_info?: Json | null;
  template_id?: string | null;
  use_template?: boolean;
}
