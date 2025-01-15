"use client"

import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export async function getTasks() {
  const { data, error } = await supabaseBrowserClient
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getTasksByProject(projectId: string) {
  const { data, error } = await supabaseBrowserClient
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTask(task: TaskInsert) {
  const { data, error } = await supabaseBrowserClient
    .from('tasks')
    .insert(task)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Partial<TaskUpdate>) {
  const { data, error } = await supabaseBrowserClient
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string) {
  const { error } = await supabaseBrowserClient
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}
