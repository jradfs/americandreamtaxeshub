"use client";

import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import type { Database } from "@/types/database.types";

export function useDatabase() {
  return supabaseBrowserClient as Database;
}
