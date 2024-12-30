import { createClient } from '@supabase/supabase-js';
import { Database, Json } from '../types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  project_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  assignee_id: string | null;
  progress: number | null;
  start_date: string | null;
  tax_form_type: string | null;
  tax_return_id: string | null;
  template_id: string | null;
  parent_task_id: string | null;
  activity_log: Json | null;
  checklist: Json | null;
  category: string | null;
  recurring_config: Json | null;
}

export async function fetchAllTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw error;
  }
}

export async function fetchTasks(projectId?: string): Promise<Task[]> {
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}
