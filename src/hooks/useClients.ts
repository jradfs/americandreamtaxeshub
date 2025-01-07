import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Client } from '@/types/clients'

export function useClients() {
  const [data, setData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: clientsData, error: supabaseError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        // Transform the data to match our Client type
        const transformedClients = clientsData?.map((client) => ({
          ...client,
          contact_info: client.contact_info || {},
          tax_info: client.tax_info || {},
        })) as Client[]

        setData(transformedClients || [])
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [supabase])

  return { data, loading, error }
}
