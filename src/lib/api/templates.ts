import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import type { Database } from "@/types/database.types";

export async function getTemplates() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTemplate(template: any) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, template: any) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .update(template)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (error) throw error;
}

export async function getCategories() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("template_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
