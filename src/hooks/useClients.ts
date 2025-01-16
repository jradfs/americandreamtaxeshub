"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  // Add other client fields as needed
}

export function useClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clients query
  const {
    data: clients,
    error: fetchError,
    isLoading,
  } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabaseBrowserClient
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  // Add client mutation
  const { mutate: addClient, isLoading: isAddingClient } = useMutation<
    Client,
    Error,
    Omit<Client, "id" | "created_at">
  >({
    mutationFn: async (clientData) => {
      const { data, error } = await supabaseBrowserClient
        .from("clients")
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    },
  });

  // Update client mutation
  const { mutate: updateClient, isLoading: isUpdatingClient } = useMutation<
    Client,
    Error,
    { id: string; updates: Partial<Client> }
  >({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabaseBrowserClient
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    },
  });

  // Delete client mutation
  const { mutate: deleteClient, isLoading: isDeletingClient } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: async (id) => {
      const { error } = await supabaseBrowserClient
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  return {
    clients,
    error: fetchError,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    isAddingClient,
    isUpdatingClient,
    isDeletingClient,
  };
}
