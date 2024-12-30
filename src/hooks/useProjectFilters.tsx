'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tables } from '../types/database.types';

type ProjectWithRelations = Tables<'projects'> & {
  client?: Tables<'clients'>;
  tasks?: Tables<'tasks'>[];
};

interface Filters {
  status?: string;
  priority?: string;
  client_id?: string;
  search?: string;
}

export function useProjectFilters() {
  const supabase = createClientComponentClient();
  const [filters, setFilters] = useState<Filters>({});
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateFilters = (newFilters: Filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('projects')
        .select('*, client:clients(*), tasks:tasks(*)');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  return {
    filters,
    updateFilters,
    projects,
    loading,
    error,
    refresh,
  };
}
