import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { handleDatabaseError } from './server'

type DbResult<T> = {
  data: T
  error: null
} | {
  data: null
  error: Error
}

export async function safeQuery<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<DbResult<T>> {
  try {
    const { data, error } = await operation()
    if (error) throw error
    if (!data) throw new Error('No data returned from the query')
    return { data, error: null }
  } catch (error) {
    return { data: null, error: handleDatabaseError(error) as Error }
  }
}

// Utility for checking if user has required permissions
export async function checkPermission(
  supabase: SupabaseClient<Database>,
  table: string,
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
): Promise<boolean> {
  try {
    switch (action) {
      case 'SELECT':
        const { data } = await supabase.from(table).select('id').limit(1)
        return data !== null
      case 'INSERT':
        const { error: insertError } = await supabase.from(table).insert({}).abortSignal
        return !insertError || !insertError.message.includes('permission denied')
      case 'UPDATE':
        const { error: updateError } = await supabase.from(table).update({}).match({ id: 'test' }).abortSignal
        return !updateError || !updateError.message.includes('permission denied')
      case 'DELETE':
        const { error: deleteError } = await supabase.from(table).delete().match({ id: 'test' }).abortSignal
        return !deleteError || !deleteError.message.includes('permission denied')
      default:
        return false
    }
  } catch {
    return false
  }
}

// Type-safe database operations
export const dbOperations = {
  // Fetch a single record by ID
  async getById<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient<Database>,
    table: T,
    id: string
  ) {
    return safeQuery(() =>
      supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
    )
  },

  // Fetch multiple records with optional filters
  async getMany<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient<Database>,
    table: T,
    options?: {
      filters?: Record<string, any>
      limit?: number
      offset?: number
      orderBy?: { column: string; ascending?: boolean }
    }
  ) {
    let query = supabase.from(table).select('*')

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    return safeQuery(() => query)
  },

  // Insert a new record
  async insert<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient<Database>,
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ) {
    return safeQuery(() =>
      supabase
        .from(table)
        .insert(data)
        .select()
        .single()
    )
  },

  // Update a record
  async update<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient<Database>,
    table: T,
    id: string,
    data: Partial<Database['public']['Tables'][T]['Update']>
  ) {
    return safeQuery(() =>
      supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    )
  },

  // Delete a record
  async delete<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient<Database>,
    table: T,
    id: string
  ) {
    return safeQuery(() =>
      supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single()
    )
  }
} 