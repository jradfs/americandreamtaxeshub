import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types/hooks'

export function useNotes(clientId?: string, projectId?: number, userId?: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [clientId, projectId, userId])

  async function fetchNotes() {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addNote({ content, ...rest }: Omit<Note, 'id' | 'created_at'>) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const noteData = {
        content,
        ...rest,
        created_at: new Date().toISOString(),
        client_id: clientId,
        user_id: userId,
        project_id: projectId
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setNotes(prev => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create note')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateNote(id: number, content: string) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const { data, error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', id)
        .select()

      if (error) throw error
      setNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteNote(id: number) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refresh: fetchNotes
  }
}
