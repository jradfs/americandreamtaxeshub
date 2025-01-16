"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import type { Tables } from "@/types/database.types";
import type { ProjectFormData } from "@/lib/validations/project";

const QUERY_KEY = "projects";

type Project = Tables<"projects">;
type ProjectResponse = { projects: Project[]; count: number };

export function useProjects() {
  const supabase = supabaseBrowserClient;
  const [sorting, setSorting] = useState({
    column: "created_at",
    direction: "desc" as "asc" | "desc",
  });
  const [filters, setFilters] = useState<{
    service_type?: string;
    status?: string;
    client_id?: string;
    date_range?: {
      start?: string;
      end?: string;
    };
  }>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [error, setError] = useState<string | null>(null);

  const buildQuery = useCallback(() => {
    let query = supabase.from("projects").select(
      `
        id,
        name,
        description,
        status,
        service_type,
        due_date,
        priority,
        client_id,
        created_at,
        tax_returns(id, tax_year, return_type)
      `,
      { count: "exact" },
    );

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "date_range" && value) {
        const { start, end } = value as { start?: string; end?: string };
        if (start) query = query.gte("due_date", start);
        if (end) query = query.lte("due_date", end);
      } else if (key !== "date_range" && value) {
        query = query.eq(key, value);
      }
    });

    // Apply sorting
    if (["due_date", "priority", "created_at"].includes(sorting.column)) {
      query = query.order(sorting.column, {
        ascending: sorting.direction === "asc",
      });
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.pageSize;
    query = query.range(from, from + pagination.pageSize - 1);

    return query;
  }, [supabase, filters, pagination, sorting]);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<ProjectResponse>(
    [QUERY_KEY, filters, sorting, pagination],
    async () => {
      try {
        setError(null);
        const query = buildQuery();
        const { data: projects, count, error } = await query;

        if (error) {
          setError("Failed to fetch projects. Please try again.");
          throw error;
        }

        return { projects: projects || [], count: count || 0 };
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("An unexpected error occurred while fetching projects.");
        throw error;
      }
    },
    {
      keepPreviousData: true,
      staleTime: 5000,
      retry: 2,
    },
  );

  const { mutateAsync: createProject } = useMutation(
    async (data: ProjectFormData) => {
      try {
        const projectData = {
          ...data,
          name: data.name || "Unnamed Project",
          client_id: data.client_id,
          status: data.status || "not_started",
        };
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (error) throw error;
        return newProject;
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY]);
      },
    },
  );

  const { mutateAsync: updateProject } = useMutation(
    async ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => {
      try {
        const { data: updatedProject, error } = await supabase
          .from("projects")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return updatedProject;
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY]);
      },
    },
  );

  const { mutateAsync: deleteProject } = useMutation(
    async (id: string) => {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY]);
      },
    },
  );

  return {
    projects: data?.projects || [],
    totalCount: data?.count || 0,
    createProject,
    updateProject,
    deleteProject,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
    isLoading,
    error: error || queryError,
  };
}
