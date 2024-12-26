'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../types/database.types';
type Project = Database['public']['Tables']['projects']['Row'];

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .neq('status', 'archived');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProjects = async () => {
    console.log('Refreshing projects...');
    const prevProjects = projects;
    await fetchProjects();
    console.log('Projects before refresh:', prevProjects);
    console.log('Projects after refresh:', projects);
    if (prevProjects.length === projects.length) {
      console.warn('Projects list length did not change after refresh');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    refreshProjects,
  };
}