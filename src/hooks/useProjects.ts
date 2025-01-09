'use client'

import { useCallback, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Tables } from '@/types/database.types'
import type { ProjectFormData } from '@/lib/validations/project'

export function useProjects() {
  const supabase = createClientComponentClient()
  const [sorting, setSorting] = useState({ column: 'created_at', direction: 'desc' })
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select('*, tax_returns(*)', { count: 'exact' })

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value)
      }
    })

    // Apply sorting
    query = query.order(sorting.column, { ascending: sorting.direction === 'asc' })

    // Apply pagination
    const from = (pagination.page - 1) * pagination.pageSize
    query = query.range(from, from + pagination.pageSize - 1)

    return query
  }, [supabase, filters, pagination, sorting])

  const fetchProjects = useCallback(async () => {
    try {
      const query = buildQuery()
      const { data: projects, count, error } = await query

      if (error) throw error

      return { projects: projects || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { projects: [], count: 0 }
    }
  }, [buildQuery])

  const createProject = useCallback(async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert(data)
        .select()
        .single()

      if (error) throw error
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }, [supabase])

  return {
    fetchProjects,
    createProject,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
  }
}
