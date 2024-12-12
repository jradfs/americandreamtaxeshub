import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TaxReturn } from '@/types/hooks'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from '@/components/ui/use-toast'

export function useTaxReturns(clientId?: string) {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchTaxReturns()
    } else {
      setTaxReturns([])
      setLoading(false)
    }
  }, [session, clientId])

  async function fetchTaxReturns() {
    try {
      let query = supabase
        .from('tax_returns')
        .select('*')
        .order('due_date', { ascending: true })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setTaxReturns(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addTaxReturn({
    filing_type,
    status,
    tax_year,
    ...rest
  }: Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!filing_type || !status || !tax_year) {
        throw new Error('Filing type, status, and tax year are required')
      }

      if (!session) {
        throw new Error('Please sign in to add tax returns')
      }

      const taxReturnData = {
        filing_type,
        status,
        tax_year,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .insert([taxReturnData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => [data[0], ...prev])
        toast({
          title: 'Success',
          description: 'Tax return added successfully'
        })
        return data[0]
      }
      throw new Error('Failed to create tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function updateTaxReturn(
    id: number,
    updates: Partial<Omit<TaxReturn, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!session) {
        throw new Error('Please sign in to update tax returns')
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => prev.map(taxReturn => taxReturn.id === id ? data[0] : taxReturn))
        toast({
          title: 'Success',
          description: 'Tax return updated successfully'
        })
        return data[0]
      }
      throw new Error('Failed to update tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function deleteTaxReturn(id: number) {
    try {
      if (!session) {
        throw new Error('Please sign in to delete tax returns')
      }

      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTaxReturns(prev => prev.filter(taxReturn => taxReturn.id !== id))
      toast({
        title: 'Success',
        description: 'Tax return deleted successfully'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  return {
    taxReturns,
    loading,
    error,
    addTaxReturn,
    updateTaxReturn,
    deleteTaxReturn,
    refresh: fetchTaxReturns
  }
}
