'use client'

import React from 'react';
import { useClients } from '@/hooks/useClients';
import { Database } from '@/types/database.types';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientListProps {
  initialClients?: Client[] | null;
}

export default function ClientList({ initialClients }: ClientListProps) {
  const { toast } = useToast();
  const { data: clients = [], error, updateClient } = useClients();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabaseBrowserClient
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  if (!clients?.length) {
    return <div>No clients found</div>;
  }

  return (
    <div className="space-y-2">
      {clients.map((client) => (
        <div key={client.id} className="border p-2 rounded shadow-sm flex justify-between">
          <div>
            <p className="font-semibold">{client.full_name || 'Unnamed Client'}</p>
            <p className="text-sm text-gray-600">{client.contact_email}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => updateClient(client.id, { status: 'active' })}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Activate
            </button>
            <button
              onClick={() => handleDelete(client.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
