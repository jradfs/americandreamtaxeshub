import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type Tables = Database['public']['Tables'];
export type Client = Tables['clients']['Row'];
export type TaxReturn = Tables['tax_returns']['Row'];
export type Document = Tables['documents']['Row'];
export type Status = 'pending' | 'in_progress' | 'review' | 'completed';

export const TABLES = {
  CLIENTS: 'clients',
  TAX_RETURNS: 'tax_returns',
  DOCUMENTS: 'documents',
} as const;

export const STATUS: Record<Status, Status> = {
  pending: 'pending',
  in_progress: 'in_progress',
  review: 'review',
  completed: 'completed',
}; 