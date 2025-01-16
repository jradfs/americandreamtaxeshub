import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import type { Database } from "@/types/database.types";

type TimeEntry = Database["public"]["Tables"]["time_entries"]["Row"];
type TimeEntryInsert = Database["public"]["Tables"]["time_entries"]["Insert"];

export function useTimeEntries() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function getTimeEntries(taskId?: string) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabaseBrowserClient
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false });

      if (taskId) {
        query = query.eq("task_id", taskId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function createTimeEntry(entry: TimeEntryInsert) {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowserClient
        .from("time_entries")
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateTimeEntry(id: string, updates: Partial<TimeEntry>) {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowserClient
        .from("time_entries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteTimeEntry(id: string) {
    setLoading(true);
    try {
      const { error } = await supabaseBrowserClient
        .from("time_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
  };
}
