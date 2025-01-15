export type DocumentCategory = 'tax_return' | 'financial_statement' | 'payroll' | 'corporate' | 'supporting';

export interface Document {
  id: string;
  project_id: string;
  client_id: string;
  name: string;
  storage_path: string;
  category: DocumentCategory;
  type: string;
  size: number;
  year?: number;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: {
    tax_year?: number;
    form_type?: string;
    business_type?: string;
    quarter?: number;
    month?: number;
  };
}

export interface DocumentReminder {
  id: string;
  document_id: string;
  due_date: string;
  status: 'pending' | 'completed';
  message: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentTracking {
  id: string;
  document_id: string;
  project_id: string;
  status: 'required' | 'received' | 'reviewed' | 'approved';
  required_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
} 