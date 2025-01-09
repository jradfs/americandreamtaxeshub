'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { TaskWithRelations } from '@/types/tasks'

interface UseTaskRelationsOptions {
  taskId: string
  enabled?: boolean
  initialData?: Partial<TaskWithRelations>
}

export function useTaskRelations({ taskId, enabled = true, initialData }: UseTaskRelationsOptions) {
  // Fetch project details
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['task', taskId, 'project'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', initialData?.project_id || '')
        .single()

      if (error) throw error
      return data
    },
    enabled: enabled && !!initialData?.project_id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    initialData: initialData?.project
  })

  // Fetch assignee details
  const { data: assignee, isLoading: isLoadingAssignee } = useQuery({
    queryKey: ['task', taskId, 'assignee'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('id', initialData?.assignee_id || '')
        .single()

      if (error) throw error
      return data
    },
    enabled: enabled && !!initialData?.assignee_id,
    staleTime: 1000 * 60 * 5,
    initialData: initialData?.assignee
  })

  // Fetch parent task details
  const { data: parentTask, isLoading: isLoadingParentTask } = useQuery({
    queryKey: ['task', taskId, 'parent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('id', initialData?.parent_task_id || '')
        .single()

      if (error) throw error
      return data
    },
    enabled: enabled && !!initialData?.parent_task_id,
    staleTime: 1000 * 60 * 5,
    initialData: initialData?.parent_task
  })

  // Fetch checklist items
  const { data: checklistItems, isLoading: isLoadingChecklist } = useQuery({
    queryKey: ['task', taskId, 'checklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: enabled,
    staleTime: 1000 * 60, // Cache for 1 minute
    initialData: initialData?.checklist_items
  })

  // Fetch activity log
  const { data: activityLog, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['task', taskId, 'activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log_entries')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: enabled,
    staleTime: 1000 * 60,
    initialData: initialData?.activity_log_entries
  })

  return {
    project,
    assignee,
    parentTask,
    checklistItems,
    activityLog,
    isLoading: 
      isLoadingProject || 
      isLoadingAssignee || 
      isLoadingParentTask || 
      isLoadingChecklist || 
      isLoadingActivity
  }
} 