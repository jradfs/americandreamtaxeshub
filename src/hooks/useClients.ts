import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Client = {
  id: string
  created_at: string
  full_name: string
  company_name: string
  contact_email: string
  phone_number: string
  type: string
  status: string
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error: supabaseError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        setClients(data || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error }
}