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