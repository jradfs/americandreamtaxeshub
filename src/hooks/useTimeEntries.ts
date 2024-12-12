import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TimeEntry, TimeEntryInsert, TimeEntryUpdate } from '@/types/hooks'

export function useTimeEntries(taskId?: number, userId?: number) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)

  useEffect(() => {
    fetchTimeEntries()
  }, [taskId, userId])

  async function fetchTimeEntries() {
    try {
      let query = supabase
        .from('time_entries')
        .select('*')
        .order('start_time', { ascending: false })

      if (taskId) {
        query = query.eq('task_id', taskId)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setTimeEntries(data)
      
      // Find active entry
      const active = data.find(entry => entry.start_time && !entry.end_time)
      setActiveEntry(active || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function startTimeEntry(entry: Omit<TimeEntryInsert, 'start_time'>) {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          ...entry,
          start_time: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      setTimeEntries(prev => [data[0], ...prev])
      setActiveEntry(data[0])
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function stopTimeEntry(id: number) {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ end_time: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error
      setTimeEntries(prev => prev.map(entry => entry.id === id ? data[0] : entry))
      setActiveEntry(null)
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateTimeEntry(id: number, updates: TimeEntryUpdate) {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setTimeEntries(prev => prev.map(entry => entry.id === id ? data[0] : entry))
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteTimeEntry(id: number) {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTimeEntries(prev => prev.filter(entry => entry.id !== id))
      if (activeEntry?.id === id) {
        setActiveEntry(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    timeEntries,
    activeEntry,
    loading,
    error,
    startTimeEntry,
    stopTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    refreshTimeEntries: fetchTimeEntries,
  }
}
