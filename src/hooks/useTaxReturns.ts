'use client'

import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { handleError } from '@/lib/error-handler';
import { Database } from '@/types/database.types';

type TaxReturn = Database['public']['Tables']['tax_returns']['Row'];

export function useTaxReturns(initialReturns?: TaxReturn[] | null) {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>(initialReturns || []);
  const [loading, setLoading] = useState(!initialReturns);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialReturns) {
      fetchTaxReturns();
    }

    const channel = supabaseBrowserClient
      .channel('tax_returns')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tax_returns' }, () => {
        fetchTaxReturns();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTaxReturns() {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowserClient
        .from('tax_returns')
        .select('*');
      if (error) throw error;
      if (data) setTaxReturns(data);
    } catch (err: any) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function createReturn(newReturn: Partial<TaxReturn>) {
    try {
      setLoading(true);
      const { error } = await supabaseBrowserClient
        .from('tax_returns')
        .insert(newReturn);
      if (error) throw error;
      await fetchTaxReturns();
    } catch (err: any) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateReturn(returnId: string, updatedFields: Partial<TaxReturn>) {
    try {
      setLoading(true);
      const { error } = await supabaseBrowserClient
        .from('tax_returns')
        .update(updatedFields)
        .eq('id', returnId);
      if (error) throw error;
      await fetchTaxReturns();
    } catch (err: any) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReturn(returnId: string) {
    try {
      setLoading(true);
      const { error } = await supabaseBrowserClient
        .from('tax_returns')
        .delete()
        .eq('id', returnId);
      if (error) throw error;
      await fetchTaxReturns();
    } catch (err: any) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }

  return {
    taxReturns,
    loading,
    error,
    createReturn,
    updateReturn,
    deleteReturn,
  };
}
