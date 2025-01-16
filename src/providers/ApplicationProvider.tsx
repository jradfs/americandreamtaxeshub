"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useClients } from "@/hooks/useClients";
import { useTasks } from "@/hooks/useTasks";

type ApplicationContextType = {
  clients: any[];
  tasks: any[];
  isLoading: boolean;
  error: Error | null;
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined,
);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const {
    data: clients,
    error: clientsError,
    isLoading: clientsLoading,
  } = useClients();
  const {
    data: tasks,
    error: tasksError,
    isLoading: tasksLoading,
  } = useTasks();

  const value = {
    clients: clients || [],
    tasks: tasks || [],
    isLoading: clientsLoading || tasksLoading,
    error: clientsError || tasksError,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider",
    );
  }
  return context;
}
