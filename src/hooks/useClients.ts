import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/providers/auth-provider'
import { Client, ClientInsert, ClientUpdate } from '@/types/hooks'
import { supabase } from '@/lib/supabase'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchClients()
    } else {
      setClients([])
      setLoading(false)
    }
  }, [session])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setClients(data || [])
    } catch (error: any) {
      console.error('Error fetching clients:', error)
      setError(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (client: ClientInsert) => {
    try {
      if (!session) {
        throw new Error('Please sign in to add clients')
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single()

      if (error) throw error

      setClients(prevClients => [data, ...prevClients])
      toast({
        title: 'Success',
        description: 'Client added successfully'
      })
      return data
    } catch (error: any) {
      console.error('Error adding client:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      if (!session) {
        throw new Error('Please sign in to update clients')
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setClients(prevClients =>
        prevClients.map(client =>
          client.id === id ? { ...client, ...data } : client
        )
      )
      toast({
        title: 'Success',
        description: 'Client updated successfully'
      })
      return data
    } catch (error: any) {
      console.error('Error updating client:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteClient = async (id: string) => {
    try {
      if (!session) {
        throw new Error('Please sign in to delete clients')
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error

      setClients(prevClients =>
        prevClients.filter(client => client.id !== id)
      )
      toast({
        title: 'Success',
        description: 'Client deleted successfully'
      })
    } catch (error: any) {
      console.error('Error deleting client:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient
  }
}
