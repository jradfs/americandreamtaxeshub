"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type OfflineChange = {
  id: string;
  table: string;
  type: "create" | "update" | "delete";
  data: any;
  timestamp: number;
};

const STORAGE_KEY = "offline_changes";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Online",
        description: "Your connection has been restored",
      });
      syncOfflineChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline",
        description: "You are now working offline",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveOfflineChange = async (
    table: string,
    type: OfflineChange["type"],
    data: any,
  ) => {
    if (isOnline) return;

    const change: OfflineChange = {
      id: crypto.randomUUID(),
      table,
      type,
      data,
      timestamp: Date.now(),
    };

    const storedChanges = await getStoredChanges();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...storedChanges, change]),
    );

    toast({
      title: "Change Saved Offline",
      description: "This change will be synced when you are back online",
    });
  };

  const getStoredChanges = async (): Promise<OfflineChange[]> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const syncOfflineChanges = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    const changes = await getStoredChanges();

    try {
      for (const change of changes) {
        const { table, type, data } = change;

        switch (type) {
          case "create":
            await supabase.from(table).insert(data);
            break;
          case "update":
            await supabase.from(table).update(data).eq("id", data.id);
            break;
          case "delete":
            await supabase.from(table).delete().eq("id", data.id);
            break;
        }
      }

      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Sync Complete",
        description: `${changes.length} changes have been synchronized`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Some changes could not be synchronized",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    saveOfflineChange,
    syncOfflineChanges,
  };
}
