import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProjectFormValues, projectSchema } from '@/lib/validations/project';
import { useServiceFields } from './useServiceFields';
import { useTaskManagement } from './useTaskManagement';
import { toast } from 'sonner';

interface UseProjectFormProps {
  onSuccess: () => void;
  initialData?: ProjectFormValues;
}

interface Client {
  id: string;
  full_name: string;
}

interface Template {
  id: string;
  title: string;
  description: string | null;
  default_priority: string;
  template_tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    dependencies: string[];
    order_index: number;
  }>;
}

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useProjectForm({ onSuccess, initialData }: UseProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [taxReturns, setTaxReturns] = useState<Array<{ id: string; name: string }>>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [taskDependencyErrors, setTaskDependencyErrors] = useState<string[]>([]);
  const supabase = createClientComponentClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      status: 'not_started',
      priority: 'medium',
      service_type: 'uncategorized',
      tasks: []
    }
  });

  const { handleServiceTypeChange, calculateProgress, validateServiceSpecificFields } = useServiceFields(form);

  // Task validation functions
  const validateTasks = () => {
    const tasks = form.getValues('tasks') || [];
    const errors: string[] = [];

    tasks.forEach((task, index) => {
      if (task.dependencies?.length) {
        task.dependencies.forEach(depTitle => {
          const depIndex = tasks.findIndex(t => t.title === depTitle);
          if (depIndex >= index) {
            errors.push(`Task "${task.title}" depends on "${depTitle}" which comes after it`);
          }
        });
      }
    });

    setTaskDependencyErrors(errors);
    return errors.length === 0;
  };

  const getTaskValidationError = (taskTitle: string) => {
    return taskDependencyErrors.find(error => error.includes(`"${taskTitle}"`));
  };

  // Task Management Functions
  const taskManagement = {
    addTask: (task: Partial<TaskSchema>) => {
      const tasks = form.getValues('tasks') || [];
      form.setValue('tasks', [
        ...tasks,
        {
          ...task,
          assignee_id: task.assignee_id || currentUser?.id,
          dependencies: task.dependencies || []
        }
      ]);
      validateTasks();
    },

    removeTask: (taskTitle: string) => {
      const tasks = form.getValues('tasks') || [];
      const updatedTasks = tasks.filter(t => t.title !== taskTitle);
      form.setValue('tasks', updatedTasks);
      validateTasks();
    },

    updateTask: (index: number, updates: Partial<TaskSchema>) => {
      const tasks = form.getValues('tasks') || [];
      const updatedTasks = [...tasks];
      updatedTasks[index] = { ...updatedTasks[index], ...updates };
      form.setValue('tasks', updatedTasks);
      validateTasks();
    },

    reorderTasks: (fromIndex: number, toIndex: number) => {
      const tasks = form.getValues('tasks') || [];
      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);
      form.setValue('tasks', updatedTasks);
      validateTasks();
    },

    handleAssigneeChange: (taskIndex: number, userId: string) => {
      const tasks = form.getValues('tasks') || [];
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        assignee_id: userId
      };
      form.setValue('tasks', updatedTasks);
    }
  };

  // Template handling
  const handleTemplateChange = async (templateId: string | null) => {
    if (!templateId) {
      setSelectedTemplate(null);
      form.setValue('tasks', []);
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(template);
    
    // Add template tasks with current user as assignee
    const tasks = template.template_tasks.map(task => ({
      ...task,
      id: task.id,
      project_template_id: template.id,
      assignee_id: currentUser?.id,
      dependencies: task.dependencies || []
    }));

    form.setValue('tasks', tasks);
    validateTasks();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user first
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        if (!session?.user) {
          throw new Error('No authenticated user');
        }

        const [clientsResponse, templatesResponse, profilesResponse] = await Promise.all([
          supabase.from('clients').select('id, full_name').order('full_name'),
          supabase.from('project_templates').select(`
            id,
            title,
            description,
            default_priority,
            template_tasks!template_tasks_template_id_fkey (
              id,
              title,
              description,
              priority,
              dependencies,
              order_index
            )
          `).order('title'),
          supabase.from('profiles').select('*')
        ]);

        // Fetch current user profile separately to ensure we get a single result
        const currentProfileResponse = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (clientsResponse.error) throw clientsResponse.error;
        if (templatesResponse.error) throw templatesResponse.error;
        if (profilesResponse.error) throw profilesResponse.error;
        if (currentProfileResponse.error) throw currentProfileResponse.error;

        setClients(clientsResponse.data || []);
        setTemplates(templatesResponse.data || []);
        setProfiles(profilesResponse.data || []);
        setCurrentUser(currentProfileResponse.data);
      } catch (error: unknown) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to load form data');
        }
        // Set empty arrays to prevent undefined errors
        setClients([]);
        setTemplates([]);
        setProfiles([]);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const getUserOptions = () => {
    return profiles.map(profile => ({
      value: profile.id,
      label: profile.name || 'Unnamed User',
      description: profile.avatar_url || ''
    }));
  };

  const watchedServiceType = form.watch('service_type');
  const watchedClientId = form.watch('client_id');
  const formProgress = calculateProgress(watchedServiceType);

  // Fetch tax returns when client is selected and service type is tax_return
  useEffect(() => {
    const fetchTaxReturns = async () => {
      if (!watchedClientId || watchedServiceType !== 'tax_return') {
        setTaxReturns([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tax_returns')
          .select('id, name')
          .eq('client_id', watchedClientId)
          .order('name');

        if (error) throw error;
        setTaxReturns(data || []);
      } catch (error) {
        console.error('Error fetching tax returns:', error);
        toast.error('Failed to load tax returns');
      }
    };

    fetchTaxReturns();
  }, [supabase, watchedClientId, watchedServiceType]);

  const getTaxReturnOptions = () => {
    return taxReturns.map(tr => ({
      value: tr.id,
      label: tr.name
    }));
  };

  return {
    form,
    isLoading,
    clients,
    templates,
    selectedTemplate,
    formProgress,
    handleServiceTypeChange,
    handleTemplateChange,
    ...taskManagement,
    getTaskValidationError,
    taskDependencyErrors,
    validateServiceSpecificFields,
    getTaxReturnOptions,
    getUserOptions,
    currentUser
  };
}
