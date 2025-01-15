'use client'

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/browser"
import { useEffect } from "react"
import type { Database } from "@/types/database.types"

type ProcessingStatus = Database['public']['Tables']['document_processing']['Row']

export function useProcessingStatus(documentId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel('processing-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_processing',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ 
            queryKey: ['processingStatus', documentId]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient, documentId])

  return useQuery<ProcessingStatus>({
    queryKey: ['processingStatus', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_processing')
        .select('*')
        .eq('document_id', documentId)
        .single()
      if (error) throw error
      return data
    }
  })
} 