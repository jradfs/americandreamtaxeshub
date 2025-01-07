'use client';

import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { ServiceType } from '@/types/projects';

interface ProjectFormContextType {
  form: UseFormReturn<ProjectFormValues>;
  isSubmitting: boolean;
  progress: number;
  onServiceTypeChange: (type: ServiceType | null) => void;
  onTemplateSelect: (templateId: string) => void;
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(
  undefined
);

export function ProjectFormProvider({
  children,
  form,
  isSubmitting,
  progress,
  onServiceTypeChange,
  onTemplateSelect,
}: ProjectFormContextType & {
  children: React.ReactNode;
}) {
  return (
    <ProjectFormContext.Provider
      value={{
        form,
        isSubmitting,
        progress,
        onServiceTypeChange,
        onTemplateSelect,
      }}
    >
      {children}
    </ProjectFormContext.Provider>
  );
}

export function useProjectFormContext() {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error(
      'useProjectFormContext must be used within a ProjectFormProvider'
    );
  }
  return context;
} 