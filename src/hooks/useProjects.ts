import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, ProjectInsert, ProjectUpdate } from '@/types/hooks'

export function useProjects(clientId?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [clientId])

  async function fetchProjects() {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('due_date', { ascending: true })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addProject(project: ProjectInsert) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()

      if (error) throw error
      setProjects(prev => [...prev, data[0]])
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateProject(id: string, updates: ProjectUpdate) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setProjects(prev => prev.map(project => project.id === id ? data[0] : project))
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  }
}
