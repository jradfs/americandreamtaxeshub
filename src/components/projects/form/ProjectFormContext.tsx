"use client";

import { createContext, useContext } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ProjectFormData } from "@/types/projects";

interface ProjectFormContextType {
  form: UseFormReturn<ProjectFormData>;
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(
  undefined,
);

export function ProjectFormProvider({
  children,
  form,
}: {
  children: React.ReactNode;
  form: UseFormReturn<ProjectFormData>;
}) {
  return (
    <ProjectFormContext.Provider value={{ form }}>
      {children}
    </ProjectFormContext.Provider>
  );
}

export function useProjectFormContext() {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error(
      "useProjectFormContext must be used within a ProjectFormProvider",
    );
  }
  return context;
}
