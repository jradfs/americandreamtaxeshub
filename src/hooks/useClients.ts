'use client'

import { useSupabase } from './useSupabase';
import { useToast } from '@/components/ui/use-toast';

export function useClients() {
  const { data, error, mutate } = useSupabase('clients');
  const { toast } = useToast();

  const addClient = async (clientData: any) => {
    try {
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      mutate();
      toast({
        title: 'Success',
        description: 'Client added successfully',
      });

      return newClient;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add client',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateClient = async (id: string, updates: any) => {
    try {
      const { data: updatedClient, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      mutate();
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });

      return updatedClient;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update client',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    data,
    error,
    addClient,
    updateClient,
  };
}
