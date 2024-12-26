'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database, TablesInsert, TablesUpdate } from '../types/database.types';
type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = TablesInsert<'projects'>;
type ProjectUpdate = TablesUpdate<'projects'>;

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: ProjectInsert) => Promise<Project>;
  updateProject: (id: string, updates: ProjectUpdate) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export function useProjects(clientId?: string): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const cacheKey = `projects-${clientId || 'all'}`;

  // Get cached projects if available
  const getCachedProjects = () => {
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  };

  // Set projects in cache
  const cacheProjects = (projects: Project[]) => {
    sessionStorage.setItem(cacheKey, JSON.stringify(projects));
  };

  const fetchProjects = async () => {
    // Return cached projects if available and not stale
    const cached = getCachedProjects();
    if (cached) {
      setProjects(cached);
    }
    setIsLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('due_date', { ascending: true })
        .neq('status', 'archived');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (project: ProjectInsert) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

      if (error) throw error;
      setProjects(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setProjects(prev => prev.map(project => project.id === id ? data[0] : project));
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
}