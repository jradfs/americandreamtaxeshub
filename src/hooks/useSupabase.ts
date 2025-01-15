'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient as supabase } from '@/lib/supabaseBrowserClient';

type UseSupabaseOptions = {
  filters?: [string, string, any][];
  orderBy?: {
    column: string;
    ascending: boolean;
  };
  select?: string;
};

export function useSupabase(table: string, options: UseSupabaseOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      let query = supabase.from(table).select(options.select || '*');

      if (options.filters) {
        options.filters.forEach(([column, operator, value]) => {
          query = query.filter(column, operator, value);
        });
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(options)]);

  const mutate = () => {
    fetchData();
  };

  return { data, error, mutate };
} 