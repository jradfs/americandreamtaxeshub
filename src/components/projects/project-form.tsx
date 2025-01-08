'use client';

import { useState } from 'react';
import { ProjectFormProvider } from './form/ProjectFormContext';
import { ProjectFormTabs } from './form/ProjectFormTabs';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormValues } from '@/lib/validations/project';
import { ProjectWithRelations } from '@/types/projects';
import { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type TaskPriority = Database['public']['Enums']['task_priority'];
type ServiceType = Database['public']['Enums']['service_type'];

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [activeTab, setActiveTab] = useState('basic-info');
  const {
    form,
    isSubmitting,
    progress,
    onServiceTypeChange,
    onTemplateSelect,
    onSubmit,
    calculateProgress,
  } = useProjectForm({
    defaultValues: project ? {
      name: project.name,
      description: project.description,
      client_id: project.client_id,
      service_type: project.service_type as ServiceType | null,
      status: project.status,
      priority: project.priority as TaskPriority | undefined,
      due_date: project.due_date,
      start_date: project.start_date,
      end_date: project.end_date,
      tax_info: project.tax_info || null,
      accounting_info: project.accounting_info || null,
      payroll_info: project.payroll_info || null,
      service_info: project.service_info || null,
      template_id: project.template_id,
      tax_return_id: project.tax_return_id,
      parent_project_id: project.parent_project_id,
      primary_manager: project.primary_manager,
      stage: project.stage,
      completed_tasks: project.completed_tasks,
      completion_percentage: project.completion_percentage,
      task_count: project.task_count
    } : undefined,
    onSubmit: async (data: ProjectFormValues) => {
      await onSuccess?.();
    },
  });

  return (
    <ProjectFormProvider
      form={form}
      isSubmitting={isSubmitting}
      progress={progress}
      onServiceTypeChange={onServiceTypeChange}
      onTemplateSelect={onTemplateSelect}
    >
      <ProjectFormTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getTabProgress={() => progress}
      />
    </ProjectFormProvider>
  );
} 