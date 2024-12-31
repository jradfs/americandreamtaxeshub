'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProjectWithRelations } from '@/types/projects';
import { DateRange } from 'react-day-picker';
import { startOfDay, endOfDay } from 'date-fns';

export interface ProjectFilters {
  search: string;
  status: string;
  priority: string;
  stage: string;
  clientId: string;
  dateRange: DateRange | undefined;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const defaultFilters: ProjectFilters = {
  search: "",
  status: "all",
  priority: "all",
  stage: "all",
  clientId: "all",
  dateRange: undefined,
  sortBy: "created",
  sortOrder: "desc"
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_info
          )
        `);

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      if (filters.stage !== 'all') {
        query = query.eq('stage', filters.stage);
      }

      if (filters.clientId !== 'all') {
        query = query.eq('client_id', filters.clientId);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.dateRange?.from) {
        query = query.gte('created_at', startOfDay(filters.dateRange.from).toISOString());
      }
      
      if (filters.dateRange?.to) {
        query = query.lte('created_at', endOfDay(filters.dateRange.to).toISOString());
      }

      // Apply sorting
      const ascending = filters.sortOrder === 'asc';
      switch (filters.sortBy) {
        case 'created':
          query = query.order('created_at', { ascending });
          break;
        case 'due':
          query = query.order('due_date', { ascending, nullsLast: true });
          break;
        case 'name':
          query = query.order('name', { ascending });
          break;
        case 'status':
          query = query.order('status', { ascending }).order('created_at', { ascending: false });
          break;
        case 'priority':
          query = query.order('priority', { ascending }).order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) throw projectsError;
      if (!projectsData) throw new Error('No projects data received');

      // Fetch tasks only if we have projects
      const projectIds = projectsData.map(p => p.id);
      let tasksData = [];
      
      if (projectIds.length > 0) {
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .in('project_id', projectIds);

        if (tasksError) throw tasksError;
        tasksData = tasks || [];
      }

      // Process projects with tasks
      const processedData = projectsData.map(project => {
        const projectTasks = tasksData.filter(task => task.project_id === project.id);
        const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
        const totalTasks = projectTasks.length;

        return {
          ...project,
          tasks: projectTasks,
          created_at: project.created_at ? new Date(project.created_at).toISOString() : null,
          due_date: project.due_date ? new Date(project.due_date).toISOString() : null,
          start_date: project.start_date ? new Date(project.start_date).toISOString() : null,
          completion_percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
      });

      setProjects(processedData);
      setError(null);

    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchProjects();

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
    setFilters(current => ({
      ...current,
      ...newFilters
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // New bulk operation functions
  const bulkUpdateProjects = useCallback(async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .in('id', projectIds);

      if (updateError) throw updateError;
      
      // Let the real-time subscription handle the update
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  }, [supabase]);

  const archiveProjects = useCallback(async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived',
      updated_at: new Date().toISOString()
    });
  }, [bulkUpdateProjects]);

  return {
    filters,
    updateFilters,
    resetFilters,
    projects,
    loading,
    error,
    refresh: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}