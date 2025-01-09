'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskWithRelations, TaskFormData, toDbTaskInsert } from '@/types/tasks'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

const TASKS_QUERY_KEY = 'tasks'
const TASKS_PER_PAGE = 10

interface UseTasksOptions {
  projectId?: string
  enabled?: boolean
  page?: number
  perPage?: number
  includeRelations?: boolean
}

interface TasksResponse {
  tasks: TaskWithRelations[]
  count: number
}

export function useTasks({ 
  projectId, 
  enabled = true,
  page = 1,
  perPage = TASKS_PER_PAGE,
  includeRelations = false
}: UseTasksOptions = {}) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Calculate pagination range
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Build select query based on whether relationships should be included
  const selectQuery = includeRelations
    ? `
      *,
      project:projects(id, name),
      assignee:users(id, email, full_name, role),
      parent_task:tasks(id, title),
      checklist_items:checklist_items(*),
      activity_log_entries:activity_log_entries(*)
    `
    : '*'

  // Fetch tasks with optional relationships and pagination
  const { data, isLoading, error } = useQuery<TasksResponse>({
    queryKey: [TASKS_QUERY_KEY, projectId, page, perPage, includeRelations],
    queryFn: async () => {
      const query = supabase
        .from('tasks')
        .select(selectQuery, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (projectId) {
        query.eq('project_id', projectId)
      }

      const { data, error, count } = await query
      if (error) throw error
      return { tasks: data || [], count: count || 0 }
    },
    enabled,
    staleTime: 1000 * 60, // Cache for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    keepPreviousData: true // Keep showing previous data while fetching new page
  })

  // Prefetch next page
  const prefetchNextPage = async () => {
    if (data && data.tasks.length === perPage) {
      await queryClient.prefetchQuery({
        queryKey: [TASKS_QUERY_KEY, projectId, page + 1, perPage, includeRelations],
        queryFn: async () => {
          const nextFrom = page * perPage
          const nextTo = nextFrom + perPage - 1

          const query = supabase
            .from('tasks')
            .select(selectQuery, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(nextFrom, nextTo)

          if (projectId) {
            query.eq('project_id', projectId)
          }

          const { data, error, count } = await query
          if (error) throw error
          return { tasks: data || [], count: count || 0 }
        },
        staleTime: 1000 * 60
      })
    }
  }

  // Create task mutation with optimistic update
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: TaskFormData) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(toDbTaskInsert(newTask))
        .select(selectQuery)
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY, projectId, page, perPage, includeRelations] })
      const previousData = queryClient.getQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations])
      
      const optimisticTask: TaskWithRelations = {
        id: crypto.randomUUID(),
        ...toDbTaskInsert(newTask),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        assigned_team: null,
        dependencies: null,
        parent_task_id: null,
        progress: null,
        recurring_config: null,
        tax_return_id: null,
        template_id: null,
        project: newTask.project_id ? { id: newTask.project_id, name: 'Loading...' } : null,
        assignee: null,
        parent_task: null,
        checklist_items: null,
        activity_log_entries: null
      }

      queryClient.setQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], old => ({
        tasks: [optimisticTask, ...(old?.tasks || []).slice(0, perPage - 1)],
        count: (old?.count || 0) + 1
      }))

      return { previousData }
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], context?.previousData)
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Task created successfully.'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, projectId] })
    }
  })

  // Update task mutation with optimistic update
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TaskWithRelations> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(selectQuery)
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY, projectId, page, perPage, includeRelations] })
      const previousData = queryClient.getQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations])

      queryClient.setQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], old => ({
        tasks: old?.tasks.map(task => task.id === updatedTask.id ? { ...task, ...updatedTask } : task) || [],
        count: old?.count || 0
      }))

      return { previousData }
    },
    onError: (_err, _updatedTask, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], context?.previousData)
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Task updated successfully.'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, projectId] })
    }
  })

  // Delete task mutation with optimistic update
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
      if (error) throw error
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY, projectId, page, perPage, includeRelations] })
      const previousData = queryClient.getQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations])

      queryClient.setQueryData<TasksResponse>([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], old => ({
        tasks: old?.tasks.filter(task => task.id !== taskId) || [],
        count: Math.max(0, (old?.count || 0) - 1)
      }))

      return { previousData }
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY, projectId, page, perPage, includeRelations], context?.previousData)
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Task deleted successfully.'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, projectId] })
    }
  })

  return {
    tasks: data?.tasks || [],
    totalTasks: data?.count || 0,
    currentPage: page,
    totalPages: Math.ceil((data?.count || 0) / perPage),
    isLoading,
    error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
    prefetchNextPage
  }
}
