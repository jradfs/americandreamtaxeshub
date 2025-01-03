import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProjectWithRelations } from '@/types/projects';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay } from 'date-fns';

import { ProjectFilters } from '@/types/projects';

export const defaultFilters: ProjectFilters = {
  search: "",
  status: "all",
  priority: "all", 
  stage: "all",
  clientId: "all",
  dateRange: undefined,
  sortBy: "created",
  sortOrder: "desc",
  dueThisWeek: false,
  dueThisMonth: false,
  dueThisQuarter: false,
  missingInfo: false,
  needsReview: false,
  readyToFile: false
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.status !== 'all') {
      params.append('status', filters.status);
    }

    if (filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }

    if (filters.stage !== 'all') {
      params.append('stage', filters.stage);
    }

    if (filters.clientId !== 'all') {
      params.append('clientId', filters.clientId);
    }

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.dateRange?.from) {
      params.append('fromDate', startOfDay(filters.dateRange.from).toISOString());
    }
    
    if (filters.dateRange?.to) {
      params.append('toDate', endOfDay(filters.dateRange.to).toISOString());
    }

    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);

    return params.toString();
  }, [filters]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString();
      const response = await fetch(`/api/projects?${queryString}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch projects');
      }

      const data = await response.json();

      // Process projects with tasks
      const processedData = data.map((project: ProjectWithRelations) => {
        const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
        const totalTasks = project.tasks?.length || 0;

        return {
          ...project,
          created_at: project.created_at ? new Date(project.created_at).toISOString() : null,
          due_date: project.due_date ? new Date(project.due_date).toISOString() : null,
          start_date: project.start_date ? new Date(project.start_date).toISOString() : null,
          completion_percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
      });

      setProjects(processedData);
      setError(null);
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch projects');
      }
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Set up real-time subscription
  useEffect(() => {
    fetchProjects();

    // Subscribe to project changes
    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [fetchProjects, supabase]);

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters(current => ({ ...current, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const sortProjects = useCallback((field: string, order: 'asc' | 'desc') => {
    updateFilters({ sortBy: field, sortOrder: order });
  }, [updateFilters]);

  // Bulk operations
  const bulkUpdateProjects = useCallback(async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const response = await fetch('/api/projects/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectIds,
          updates: {
            ...updates,
            updated_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update projects');
      }

      await fetchProjects(); // Refresh the list after bulk update
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  }, [fetchProjects]);

  const archiveProjects = useCallback(async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived'
    });
  }, [bulkUpdateProjects]);

  return {
    filters,
    projects,
    loading,
    error,
    updateFilters,
    resetFilters,
    sortProjects,
    refreshProjects: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}
