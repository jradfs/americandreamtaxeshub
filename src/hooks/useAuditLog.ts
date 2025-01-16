import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Database } from "@/types/database.types";

type AuditLog = Database["public"]["Tables"]["audit_log"]["Row"];

export function useAuditLog() {
  async function logAction(action: string, details: string) {
    await supabaseBrowserClient.from("audit_log").insert({ action, details });
  }

  return { logAction };
}
