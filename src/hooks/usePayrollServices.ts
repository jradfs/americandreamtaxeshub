import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PayrollService } from "@/types/hooks";

export function usePayrollServices(clientId?: string) {
  const [services, setServices] = useState<PayrollService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [clientId]);

  async function fetchServices() {
    try {
      let query = supabase
        .from("payroll_services")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function addService({
    service_name,
    frequency,
    ...rest
  }: Omit<PayrollService, "id" | "created_at" | "updated_at">) {
    try {
      if (!service_name || !frequency) {
        throw new Error("Service name and frequency are required");
      }

      const serviceData = {
        service_name,
        frequency,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("payroll_services")
        .insert([serviceData])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setServices((prev) => [data[0], ...prev]);
        return data[0];
      }
      throw new Error("Failed to create payroll service");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }

  async function updateService(
    id: number,
    updates: Partial<Omit<PayrollService, "id" | "created_at" | "client_id">>,
  ) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("payroll_services")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setServices((prev) =>
          prev.map((service) => (service.id === id ? data[0] : service)),
        );
        return data[0];
      }
      throw new Error("Failed to update payroll service");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }

  async function deleteService(id: number) {
    try {
      const { error } = await supabase
        .from("payroll_services")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    refresh: fetchServices,
  };
}
