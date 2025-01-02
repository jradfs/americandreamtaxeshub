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
        name: values.name.trim(),
        description: values.description?.trim(),
        client_id: values.client_id,
        status: values.status,
        priority: values.priority,
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type,
        template_id: values.template_id,
        tax_return_id: values.tax_return_id,
        tax_return_status: values.tax_return_status,
        accounting_period: values.accounting_period,
        team_members: values.team_members,
        tasks: sortedTasks.map((task, index) => ({
          title: task.title.trim(),
          description: task.description?.trim(),
          priority: task.priority,
          dependencies: task.dependencies || [],
          order_index: index,
          assigned_to: task.assigned_to
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      const data = await response.json();

      // Update tax return status if needed
      if (values.service_type === 'tax_return' && values.tax_return_id && values.tax_return_status) {
        const taxResponse = await fetch(`/api/tax-returns/${values.tax_return_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: values.tax_return_status
          })
        });

        if (!taxResponse.ok) {
          console.error('Failed to update tax return status');
        }
      }

      toast.success('Project created successfully');
      onSuccess();
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
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
