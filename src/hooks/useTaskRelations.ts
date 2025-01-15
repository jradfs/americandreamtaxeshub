'use client'

import { useState } from 'react'
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import type { Database } from '@/types/database.types'

type TaskRelation = Database['public']['Tables']['task_relations']['Row']
type TaskRelationInsert = Database['public']['Tables']['task_relations']['Insert']

export function useTaskRelations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function getTaskRelations(taskId: string) {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('task_relations')
        .select('*')
        .eq('task_id', taskId)

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function createTaskRelation(relation: TaskRelationInsert) {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('task_relations')
        .insert(relation)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateTaskRelation(id: string, updates: Partial<TaskRelation>) {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('task_relations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteTaskRelation(id: string) {
    setLoading(true)
    try {
      const { error } = await supabaseBrowserClient
        .from('task_relations')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getTaskRelations,
    createTaskRelation,
    updateTaskRelation,
    deleteTaskRelation
  }
} 