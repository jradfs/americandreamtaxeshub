"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/providers/unified-auth-provider";
import type { Database } from "@/types/database.types";

type ProjectTemplate = Database["public"]["Tables"]["project_templates"]["Row"];

export function useProjectTemplates() {
  const { supabase } = useAuth();
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("project_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to fetch project templates"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(
    async (templateData: Partial<ProjectTemplate>) => {
      try {
        const { data, error } = await supabase
          .from("project_templates")
          .insert([templateData])
          .select()
          .single();

        if (error) throw error;
        setTemplates((prev) => [data, ...prev]);
        return data;
      } catch (e) {
        throw e instanceof Error
          ? e
          : new Error("Failed to create project template");
      }
    },
    [supabase],
  );

  const updateTemplate = useCallback(
    async (id: string, templateData: Partial<ProjectTemplate>) => {
      try {
        const { data, error } = await supabase
          .from("project_templates")
          .update(templateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        setTemplates((prev) =>
          prev.map((template) => (template.id === id ? data : template)),
        );
        return data;
      } catch (e) {
        throw e instanceof Error
          ? e
          : new Error("Failed to update project template");
      }
    },
    [supabase],
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("project_templates")
          .delete()
          .eq("id", id);

        if (error) throw error;
        setTemplates((prev) => prev.filter((template) => template.id !== id));
      } catch (e) {
        throw e instanceof Error
          ? e
          : new Error("Failed to delete project template");
      }
    },
    [supabase],
  );

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
}
