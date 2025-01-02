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
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Template {
  id: string;
  title: string;
  description: string | null;
  default_priority: string;
  tasks: Array<{
    title: string;
    description: string;
    priority: string;
    dependencies: string[];
    order_index: number;
  }>;
}

export function useProjectForm({ onSuccess, initialData }: UseProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [taxReturns, setTaxReturns] = useState<Array<{ id: string; name: string }>>([]);
  const supabase = createClientComponentClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      status: 'not_started',
      priority: 'medium',
      service_type: 'uncategorized',
      tasks: [],
      team_members: []
    }
  });

  const { handleServiceTypeChange, calculateProgress, validateServiceSpecificFields } = useServiceFields(form);
  const { 
    addTask, 
    removeTask, 
    updateTask,
    reorderTasks,
    validateTasks,
    getTaskValidationError,
    taskDependencyErrors 
  } = useTaskManagement(form);

  const watchedServiceType = form.watch('service_type');
  const watchedClientId = form.watch('client_id');
  const formProgress = calculateProgress(watchedServiceType);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      }
    };

    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('project_templates')
          .select(`
            id,
            title,
            description,
            default_priority,
            tasks (
              title,
              description,
              priority,
              dependencies,
              order_index
            )
          `);

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role')
          .order('name');

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
      }
    };

    fetchClients();
    fetchTemplates();
    fetchTeamMembers();
  }, [supabase]);

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

  const handleTemplateChange = async (templateId: string | null) => {
    if (!templateId) {
      setSelectedTemplate(null);
      form.setValue('tasks', []);
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(template);
    
    // Add template tasks
    const tasks = template.tasks.map(task => ({
      ...task,
      dependencies: task.dependencies || []
    }));

    form.setValue('tasks', tasks);
    validateTasks();
  };

  const handleTeamMemberChange = (teamMembers: string[]) => {
    form.setValue('team_members', teamMembers);
    validateTasks(); // Revalidate tasks to check team member assignments
  };

  const getTeamMemberOptions = () => {
    return teamMembers.map(member => ({
      value: member.id,
      label: member.name,
      description: member.role
    }));
  };

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
    handleTeamMemberChange,
    addTask,
    removeTask,
    updateTask,
    reorderTasks,
    getTaskValidationError,
    taskDependencyErrors,
    validateServiceSpecificFields,
    getTeamMemberOptions,
    getTaxReturnOptions
  };
}
