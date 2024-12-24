import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Task, ViewType, GroupingType } from '@/types/workspace'
import { Database } from '@/types/supabase'

type WorkspaceState = {
  tasks: Task[]
  view: ViewType
  grouping: GroupingType
  loading: boolean
  error: Error | null
}

type WorkspaceActions = {
  setView: (view: ViewType) => void
  setGrouping: (grouping: GroupingType) => void
  createTask: (task: Partial<Task>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export function useWorkspace(workspaceId: string) {
  const supabase = createClientComponentClient<Database>()
  const [state, setState] = useState<WorkspaceState>({
    tasks: [],
    view: 'list',
    grouping: 'status',
    loading: true,
    error: null,
  })

  // Load initial data
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*, assignee:assignee_id(*), client:client_id(*)')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })

        if (error) throw error

        setState(prev => ({
          ...prev,
          tasks: data || [],
          loading: false
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false
        }))
      }
    }

    fetchTasks()

    // Set up real-time subscription
    const tasksSubscription = supabase
      .channel('workspace_tasks')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `workspace_id=eq.${workspaceId}`
        }, 
        async (payload) => {
          // Refresh tasks when changes occur
          const { data, error } = await supabase
            .from('tasks')
            .select('*, assignee:assignee_id(*), client:client_id(*)')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })

          if (!error && data) {
            setState(prev => ({
              ...prev,
              tasks: data
            }))
          }
        }
      )
      .subscribe()

    return () => {
      tasksSubscription.unsubscribe()
    }
  }, [workspaceId, supabase])

  const actions: WorkspaceActions = {
    setView: (view) => setState(prev => ({ ...prev, view })),
    
    setGrouping: (grouping) => setState(prev => ({ ...prev, grouping })),
    
    createTask: async (task) => {
      try {
        const { error } = await supabase
          .from('tasks')
          .insert([{ ...task, workspace_id: workspaceId }])
        if (error) throw error
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error
        }))
        throw error
      }
    },

    updateTask: async (id, updates) => {
      try {
        const { error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
        if (error) throw error
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error
        }))
        throw error
      }
    },

    deleteTask: async (id) => {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
        if (error) throw error
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error
        }))
        throw error
      }
    }
  }

  return {
    ...state,
    ...actions
  }
}