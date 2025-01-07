import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { ProjectTemplate, ProjectTemplateInput } from '@/types/projects'

export function useProjectTemplates() {
  const { supabase } = useSupabase()
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_templates')
        .select('*, template_tasks(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createTemplate = useCallback(async (template: ProjectTemplateInput) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .insert(template)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template')
    }
  }, [supabase])

  const updateTemplate = useCallback(async (id: string, updates: Partial<ProjectTemplateInput>) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .update(updates)
        .eq('id', id)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template')
    }
  }, [supabase])

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template')
    }
  }, [supabase])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  }
}