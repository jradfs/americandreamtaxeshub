'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'
import type { 
  Project, 
  ProjectWithRelations, 
  ProjectTemplate, 
  ProjectStatus, 
  ServiceType 
} from '@/types/hooks'
import type { Task } from '@/types/tasks'
import { toast } from 'sonner'
import { 
  FilterState, 
  PaginationState, 
  SortingState, 
  ProjectFilters 
} from '@/types/hooks'

interface ProjectResponse<T> {
  data: T | null
  error: string | null
}

export function useProjects(initialFilters?: ProjectFilters) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {})
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 1000
  })
  const [sorting, setSorting] = useState<SortingState>({
    column: 'created_at',
    direction: 'desc'
  })
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClientComponentClient<Database>()

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients!projects_client_id_fkey (*),
        tasks!tasks_project_id_fkey (
          *,
          checklist_items(*),
          activity_log_entries(*)
        )
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

  const fetchTaxReturns = useCallback(async (projectIds: string[]): Promise<Map<string, Database['public']['Tables']['tax_returns']['Row']>> => {
    if (!projectIds.length) return new Map()

    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .in('id', projectIds)

      if (error) {
        console.error('Error fetching tax returns:', error)
        return new Map()
      }

      return new Map(data?.map(tr => [tr.id, tr]) || [])
    } catch (error) {
      console.error('Error in fetchTaxReturns:', error)
      return new Map()
    }
  }, [supabase])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const query = buildQuery()
      const { data: projectsData, error: projectsError, count } = await query

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        toast.error('Failed to load projects')
        throw projectsError
      }

      // Fetch tax returns separately for projects that have tax_return_id
      const projectsWithTaxReturns = projectsData?.filter(p => p.tax_return_id) || []
      const taxReturnsMap = await fetchTaxReturns(projectsWithTaxReturns.map(p => p.tax_return_id))

      // Combine the data
      const enrichedProjects = projectsData?.map(project => ({
        ...project,
        tax_return: project.tax_return_id ? taxReturnsMap.get(project.tax_return_id) : undefined
      })) as ProjectWithRelations[]

      setProjects(enrichedProjects)
      if (count !== null) setTotalCount(count)
    } catch (error) {
      console.error('Error in fetchProjects:', error)
      setProjects([])
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [buildQuery, fetchTaxReturns])

  const fetchTaxReturnForProject = async (projectId: string): Promise<Database['public']['Tables']['tax_returns']['Row'] | null> => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project?.tax_return_id) return null

      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .eq('id', project.tax_return_id)
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

  const createProject = async (projectData: NewProject & { tasks?: Task[] }): Promise<ProjectResponse<ProjectWithRelations>> => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError

      // Handle tasks and their related items
      if (projectData.tasks?.length) {
        for (const task of projectData.tasks) {
          // Create task
          const { data: newTask, error: taskError } = await supabase
            .from('tasks')
            .insert({
              ...task,
              project_id: project.id
            })
            .select()
            .single()

          if (taskError) throw taskError

          // Create checklist items if any
          if (task.checklist_items?.length) {
            const { error: checklistError } = await supabase
              .from('checklist_items')
              .insert(
                task.checklist_items.map(item => ({
                  ...item,
                  task_id: newTask.id
                }))
              )

            if (checklistError) throw checklistError
          }

          // Add initial activity log entry
          const { error: activityError } = await supabase
            .from('activity_log_entries')
            .insert({
              task_id: newTask.id,
              type: 'created',
              details: { status: newTask.status }
            })

          if (activityError) throw activityError
        }
      }

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error: 'Failed to create project' }
    }
  }

  const updateProject = async (projectId: string, updates: UpdateProject): Promise<ProjectResponse<ProjectWithRelations>> => {
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

  const deleteProject = async (projectId: string): Promise<{ error: string | null }> => {
    try {
      // Delete related records first
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', projectId)

      if (tasks?.length) {
        // Delete task-related records
        await Promise.all(tasks.map(task => Promise.all([
          supabase.from('checklist_items').delete().eq('task_id', task.id),
          supabase.from('activity_log_entries').delete().eq('task_id', task.id)
        ])))
      }

      // Then delete notes
      await supabase.from('notes').delete().eq('project_id', projectId)

      // Finally delete the project
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
    fetchTaxReturnForProject
  }
}
