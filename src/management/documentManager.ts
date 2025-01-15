import { supabase } from "../lib/supabaseClient";

export async function updateDocumentStatus(documentId: string, newStatus: string) {
  const { data, error } = await supabase
    .from("documents")
    .update({ document_status: newStatus })
    .eq("id", documentId);

  if (error) {
    throw new Error(`Failed to update document status: ${error.message}`);
  }

  return data;
} 