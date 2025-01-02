'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { ProjectWithRelations, NewProject, UpdateProject, ProjectStatus, ServiceType } from '@/types/projects'
import { toast } from 'sonner'
import { FilterState, PaginationState, SortingState } from '@/types/hooks'

interface ProjectFilters extends FilterState {
  status?: ProjectStatus[]
  serviceType?: ServiceType[]
  clientId?: string
  dueDateRange?: {
    from: Date
    to: Date
  }
}

export function useProjects(initialFilters?: ProjectFilters) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [sorting, setSorting] = useState<SortingState>({
    id: 'created_at',
    desc: true
  })
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClientComponentClient<Database>()

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients!projects_client_id_fkey (*),
        tasks!tasks_project_id_fkey (*)
      `, { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    if (filters.status?.length) {
      query = query.in('status', filters.status)
    }
    if (filters.serviceType?.length) {
      query = query.in('service_type', filters.serviceType)
    }
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters.dueDateRange) {
      query = query
        .gte('due_date', filters.dueDateRange.from.toISOString())
        .lte('due_date', filters.dueDateRange.to.toISOString())
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = pagination.pageIndex * pagination.pageSize
    const to = from + pagination.pageSize - 1
    query = query.range(from, to)

    return query
  }, [supabase, filters, pagination])

  const fetchTaxReturns = useCallback(async (projectIds: string[]) => {
    if (!projectIds.length) return new Map();

    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .select('id, tax_year, filing_type, status, due_date, project_id')
        .in('project_id', projectIds);

      if (error) {
        console.error('Error fetching tax returns:', error);
        return new Map();
      }

      return new Map(data?.map(tr => [tr.project_id, tr]) || []);
    } catch (error) {
      console.error('Error in fetchTaxReturns:', error);
      return new Map();
    }
  }, [supabase]);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const query = buildQuery();
      const { data: projectsData, error: projectsError, count } = await query;

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        toast.error('Failed to load projects');
        throw projectsError;
      }

      // Fetch tax returns separately for projects that have tax_return_id
      const projectsWithTaxReturns = projectsData?.filter(p => p.tax_return_id) || [];
      const taxReturnsMap = await fetchTaxReturns(projectsWithTaxReturns.map(p => p.id));

      // Combine the data
      const enrichedProjects = projectsData?.map(project => ({
        ...project,
        tax_return: taxReturnsMap.get(project.id) || null
      })) || [];

      setProjects(enrichedProjects);
      if (count !== null) setTotalCount(count);
    } catch (error) {
      console.error('Error in fetchProjects:', error);
      setProjects([]);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, fetchTaxReturns]);

  const fetchTaxReturnForProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .select('id, tax_year, filing_type, status, due_date')
        .eq('project_id', projectId)
        .single()

      if (error) {
        if (error.code === '42501') { // Permission denied
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching tax return:', error)
      return null
    }
  }

  const createProject = async (projectData: NewProject) => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError

      // Handle tasks
      if (projectData.tasks?.length) {
        const tasks = projectData.tasks.map(task => ({
          ...task,
          project_id: project.id
        }))

        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasks)

        if (tasksError) throw tasksError
      }

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error: 'Failed to create project' }
    }
  }

  const updateProject = async (projectId: string, updates: UpdateProject) => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (projectError) throw projectError

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error: 'Failed to update project' }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      // Delete related records first
      await Promise.all([
        supabase.from('tasks').delete().eq('project_id', projectId),
        supabase.from('time_entries').delete().eq('project_id', projectId),
        supabase.from('notes').delete().eq('project_id', projectId)
      ])

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      await fetchProjects()
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error: 'Failed to delete project' }
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => {
        fetchProjects()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchProjects])

  // Initial fetch
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    totalCount,
    filters,
    setFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    createProject,
    updateProject,
    deleteProject,
    fetchTaxReturnForProject,
    refreshProjects: fetchProjects
  }
}
