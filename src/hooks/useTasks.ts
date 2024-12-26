import { useState, useEffect } from 'react'
import { supabase } from 'src/lib/supabase'
import { Task, TaskUpdate, TaskFormData } from 'src/types/task'
import { Database } from 'src/types/database.types'

interface UseTasksOptions {
  projectId?: string;
  clientId?: string;
  assignedUserId?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
const [tasks, setTasks] = useState<Task[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
type TaskRow = Database['public']['Tables']['tasks']['Row']
  useEffect(() => {
    fetchTasks()
  }, [options.projectId, options.clientId, options.assignedUserId])

  async function fetchTasks() {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          assignee_id,
          due_date,
          progress,
          created_at,
          updated_at,
          project_id,
          project:projects (
            id,
            name,
            client_id
          )
        `)
        .order('due_date', { ascending: true })

      if (options.projectId) {
        query = query.eq('project_id', options.projectId)
      }

      if (options.clientId) {
        query = query.eq('project.client_id', options.clientId)
      }

      if (options.assignedUserId) {
        query = query.eq('assignee_id', options.assignedUserId)
      }

      const { data, error } = await query
      if (error) throw error
      setTasks(
        (data || []).map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: task.status as 'todo' | 'in_progress' | 'completed' | 'blocked',
          priority: task.priority as 'low' | 'medium' | 'high',
          assignee_id: task.assignee_id,
          due_date: task.due_date,
          progress: task.progress || 0,
          created_at: task.created_at,
          updated_at: task.updated_at,
          project_id: task.project_id,
          is_recurring: false,
          parent_task_id: '',
          tax_return_id: '',
          tax_form_type: ''
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  async function addTask(task: TaskFormData) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task as any])
        .select() as any
      if (error) {
        setError(error.message)
        throw error
      }
      setTasks(prev => [...prev, data[0] as Task])
      return data[0] as Task
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }
  async function updateTask(id: string, updates: TaskUpdate) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', Number(id))
        .select() as any
      if (error) {
        setError(error.message);
        throw error;
      }
      setTasks(prev => prev.map(task => task.id === id ? data[0] as Task : task) as Task[]);
      return data[0] as Task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function deleteTask(id: string) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', Number(id)) as any
      if (error) {
        setError(error.message);
        throw error;
      }
      setTasks(prev => prev.filter(task => task.id !== id) as Task[]);
      return data as any;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  }
}
