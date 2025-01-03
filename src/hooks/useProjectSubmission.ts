import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectFormValues, validateTaskDependencies, sortTasksByDependencies } from '@/lib/validations/project';

export const useProjectSubmission = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitProject = async (values: ProjectFormValues) => {
    setIsLoading(true);

    try {
      // Validate tasks before submission
      if (values.tasks?.length && !validateTaskDependencies(values.tasks)) {
        throw new Error('Invalid task dependencies');
      }

      // Sort tasks by dependencies to ensure correct order
      const sortedTasks = values.tasks ? sortTasksByDependencies(values.tasks) : [];

      // Prepare project data
      const projectData = {
        creation_type: values.creation_type,
        template_id: values.template_id,
        name: values.name.trim(),
        description: values.description?.trim(),
        client_id: values.client_id,
        status: values.status,
        priority: values.priority,
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type,
        tax_info: values.tax_info || {},
        accounting_info: values.accounting_info || {},
        payroll_info: values.payroll_info || {},
        tax_return_id: values.tax_return_id,
        team_members: values.team_members || [],
        tasks: sortedTasks.map((task, index) => ({
          title: task.title.trim(),
          description: task.description?.trim(),
          priority: task.priority,
          dependencies: task.dependencies || [],
          order_index: index,
          assignee_id: task.assignee_id
        }))
      };

      // Submit project through API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create project');
      }

      toast.success('Project created successfully');
      onSuccess();
      return { data: responseData, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      console.error('Project creation error:', err);
      toast.error(message);
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitProject
  };
};
