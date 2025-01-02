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
        tax_return:tax_returns!fk_projects_tax_return (
          id,
          tax_year,
          filing_type,
          status,
          due_date
        ),
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
    query = query.order(sorting.id, { ascending: !sorting.desc })

    // Apply pagination
    const from = pagination.pageIndex * pagination.pageSize
    const to = from + pagination.pageSize - 1
    query = query.range(from, to)

    return query
  }, [supabase, filters, pagination, sorting])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const query = buildQuery()
      const { data, error, count } = await query

      if (error) {
        console.error('Error details:', error)
        
        // Handle specific error cases
        if (error.code === '42501' && error.message?.includes('tax_returns')) {
          // If permission denied for tax_returns, try fetching without tax returns
          const fallbackQuery = supabase
            .from('projects')
            .select(`
              *,
              client:clients!projects_client_id_fkey (*),
              tasks!tasks_project_id_fkey (*)
            `, { count: 'exact' })
            .order(sorting.id, { ascending: !sorting.desc })
            .range(
              pagination.pageIndex * pagination.pageSize,
              (pagination.pageIndex * pagination.pageSize) + pagination.pageSize - 1
            )
          
          // Apply the same filters as the original query
          if (filters.search) {
            fallbackQuery.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
          }
          if (filters.status?.length) {
            fallbackQuery.in('status', filters.status)
          }
          if (filters.serviceType?.length) {
            fallbackQuery.in('service_type', filters.serviceType)
          }
          if (filters.clientId) {
            fallbackQuery.eq('client_id', filters.clientId)
          }
          if (filters.dueDateRange) {
            fallbackQuery
              .gte('due_date', filters.dueDateRange.from.toISOString())
              .lte('due_date', filters.dueDateRange.to.toISOString())
          }
          
          const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery
          
          if (fallbackError) {
            console.error('Fallback query error:', fallbackError)
            toast.error('Failed to load projects. Please try again.')
            throw fallbackError
          }
          
          // Map the data to include empty tax_return field
          const mappedData = fallbackData?.map(project => ({
            ...project,
            tax_return: null
          })) || []
          
          setProjects(mappedData)
          if (fallbackCount !== null) setTotalCount(fallbackCount)
          return
        }
        
        toast.error('Failed to load projects. Please try again.')
        throw error
      }

      setProjects(data || [])
      if (count !== null) setTotalCount(count)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([]) // Set empty array on error to prevent undefined access
    } finally {
      setLoading(false)
    }
  }, [buildQuery, supabase, filters, pagination, sorting])

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
    refreshProjects: fetchProjects
  }
}
