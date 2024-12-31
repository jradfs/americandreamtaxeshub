import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';

export async function getCategories(): Promise<Tables<'template_categories'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('template_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  }

  return data;
}

export async function getTemplates(): Promise<Tables<'project_templates'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return null;
  }

  return data;
}

export async function getTemplateWithTasks(
  templateId: string
): Promise<Tables<'project_templates'> & { tasks: Tables<'template_tasks'>[] } | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select(`
      *,
      tasks: template_tasks (*)
    `)
    .eq('id', templateId)
    .single();

  if (error) {
    console.error('Error fetching template with tasks:', error);
    return null;
  }

  return data;
}
