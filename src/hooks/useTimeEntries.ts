import { useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { TimeEntry, TimeEntryWithRelations } from '@/types/hooks'
import { Task, TaskWithRelations } from '@/types/tasks'
import { Project, ProjectWithRelations } from '@/types/hooks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const useTimeEntries = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

  const fetchTimeEntries = useCallback(async (
    filters?: {
      userId?: string
      taskId?: string
      projectId?: string
      startDate?: string
      endDate?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          task:tasks(*),
          project:projects(*),
          user:users(*)
        `)

      if (filters?.userId) query = query.eq('user_id', filters.userId)
      if (filters?.taskId) query = query.eq('task_id', filters.taskId)
      if (filters?.projectId) query = query.eq('project_id', filters.projectId)
      if (filters?.startDate) query = query.gte('start_time', filters.startDate)
      if (filters?.endDate) query = query.lte('end_time', filters.endDate)
      if (filters?.billable !== undefined) query = query.eq('billable', filters.billable)

      const { data, error } = await query

      if (error) throw error

      setTimeEntries(data as TimeEntryWithRelations[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const startTimeEntry = useCallback(async (
    entryData: {
      task_id?: string
      project_id?: string
      description?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      // Check for any active time entry
      const { data } = await supabase
        .from('time_entries')
        .select('*')
        .is('end_time', null)

      const active = data?.find(entry => entry.start_time && !entry.end_time)

      if (active) {
        throw new Error('An active time entry already exists. Please stop it first.')
      }

      const { data: userData } = await supabase.auth.getUser()

      const { data: newEntry, error } = await supabase
        .from('time_entries')
        .insert({
          ...entryData,
          start_time: new Date().toISOString(),
          end_time: null,
          user_id: userData.user?.id
        })
        .select()

      if (error) throw error

      setTimeEntries(prev => [...prev, newEntry[0]])
      return newEntry[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const stopTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ 
          end_time: new Date().toISOString() 
        })
        .eq('id', entryId)
        .select()

      if (error) throw error

      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, end_time: data[0].end_time } 
            : entry
        )
      )

      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    timeEntries,
    loading,
    error,
    fetchTimeEntries,
    startTimeEntry,
    stopTimeEntry,
    deleteTimeEntry,
    setTimeEntries
  }
}
