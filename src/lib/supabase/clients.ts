import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type ClientServiceConfig = {
  tax_preparation: any | null;
  bookkeeping: any | null;
  payroll: any | null;
  advisory: any | null;
};

export type OnboardingProgress = {
  status: "pending" | "in_progress" | "completed";
  completed_steps: string[];
  next_steps: string[];
  documents_received: string[];
};

export type Client = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  service_config: ClientServiceConfig;
  document_requirements: any[];
  onboarding_progress: OnboardingProgress;
};

export async function getAllClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching clients: ${error.message}`);
  }

  return data;
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching client: ${error.message}`);
  }

  return data;
}

export async function createClient(clientData: Partial<Client>) {
  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating client: ${error.message}`);
  }

  return data;
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating client: ${error.message}`);
  }

  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting client: ${error.message}`);
  }

  return true;
}

export async function getClientDocuments(clientId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching client documents: ${error.message}`);
  }

  return data;
}

export async function getClientProjects(clientId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching client projects: ${error.message}`);
  }

  return data;
}

export async function updateClientOnboardingProgress(
  clientId: string,
  onboardingProgress: Partial<OnboardingProgress>,
) {
  const { data, error } = await supabase
    .from("clients")
    .update({ onboarding_progress: onboardingProgress })
    .eq("id", clientId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Error updating client onboarding progress: ${error.message}`,
    );
  }

  return data;
}

export async function updateClientServiceConfig(
  clientId: string,
  serviceConfig: Partial<ClientServiceConfig>,
) {
  const { data, error } = await supabase
    .from("clients")
    .update({ service_config: serviceConfig })
    .eq("id", clientId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating client service config: ${error.message}`);
  }

  return data;
}
