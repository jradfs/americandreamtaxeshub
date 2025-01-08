# Code Analysis Snapshot

## Large Files Analysis

### `src\components\clients\client-form.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { DbClient, DbClientContactDetails, TaxInfo } from '@/types/clients'

interface ClientFormProps {
  client?: DbClient & {
    contact_details?: DbClientContactDetails | null
    tax_info?: TaxInfo | null
  } | null
  onSubmit: (data: ClientFormSchema) => Promise<void>
}

export function ClientForm({ client, onSubmit }: ClientFormProps) {
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client?.id || '',
      full_name: client?.full_name || '',
      company_name: client?.company_name || '',
      contact_email: client?.contact_email || '',
      status: client?.status || 'pending',
      type: client?.type || 'individual',
      contact_details: client?.contact_details || {
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      },
      tax_info: client?.tax_info || {
        filing_status: '',
        tax_id: '',
        tax_year: new Date().getFullYear(),
        filing_type: null,
        tax_id_type: null,
        dependents: [],
        previous_returns: []
      }
    },
  })

  const handleSubmit = async (data: ClientFormSchema) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Failed to submit client:', error)
    }
  }

  return (
    <Form form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter contact email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contact_details.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Enter phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_details.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_details.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_details.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_details.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ZIP code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tax_info.tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tax ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_info.filing_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter filing status" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_info.tax_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Year</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Enter tax year" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
} 
```

### `src\components\tasks\task-form.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { taskSchema } from '@/lib/validations/task'
import type { DbTask, TaskFormValues } from '@/types/tasks'
import { PrioritySelect } from '@/components/ui/priority-select'
import { StatusSelect } from '@/components/ui/status-select'

interface TaskFormProps {
  task?: DbTask | null
  onSubmit: (data: TaskFormValues) => Promise<void>
  onCancel?: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      ...task,
      status: task.status,
      priority: task.priority,
    } : {
      title: '',
      description: '',
      status: 'todo',
      priority: undefined,
      due_date: null,
      start_date: null,
      recurring_config: null,
    }
  })

  const handleSubmit = async (data: TaskFormValues) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Failed to submit task:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter task title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter task description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <StatusSelect<TaskFormValues>
          name="status"
          control={form.control}
        />

        <PrioritySelect<TaskFormValues>
          name="priority"
          control={form.control}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {task ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
```

### `src\hooks\useProjectManagement.ts`

```typescript
import { useState, useCallback, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format, startOfWeek, endOfWeek, addMonths } from 'date-fns';
import type { 
  ProjectWithRelations, 
  ServiceCategory, 
  TaxReturnType, 
  ProjectStatus, 
  Priority 
} from '@/types/projects';
import type { ReviewStatus } from '@/types/tasks';
import { useToast } from '@/components/ui/use-toast';
import { useProjectFilters } from './useProjectFilters';
import type { ProjectFilters } from './useProjectFilters';

export function useProjectManagement(): {
  projects: ProjectWithRelations[];
  loading: boolean;
  error: Error | null;
  filters: ProjectFilters;
  updateFilters: (updates: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  filterProjects: (projects: ProjectWithRelations[]) => ProjectWithRelations[];
  groupProjects: (projects: ProjectWithRelations[], groupBy: string) => { [key: string]: ProjectWithRelations[] };
  refresh: () => Promise<void>;
  bulkUpdateProjects: (projectIds: string[], updates: Partial<ProjectWithRelations>) => Promise<boolean>;
  archiveProjects: (projectIds: string[]) => Promise<boolean>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { filters, updateFilters, resetFilters, filterProjects: applyFilters } = useProjectFilters();

  const groupKeyMap = {
    status: (project: ProjectWithRelations) => project.status || 'No Status',
    service: (project: ProjectWithRelations) => project.service_category || 'Uncategorized',
    deadline: (project: ProjectWithRelations) => {
      if (!project.due_date) return 'No Due Date';
      const dueDate = new Date(project.due_date);
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);

      if (dueDate < today) return 'Overdue';
      if (dueDate <= weekEnd) return 'This Week';
      if (dueDate <= addMonths(today, 1)) return 'Next Month';
      return 'Later';
    },
    client: (project: ProjectWithRelations) => project.client?.name || 'No Client'
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          tasks:project_tasks(
            *,
            checklist_items(*),
            activity_log_entries(*)
          ),
          tax_return:tax_returns(*)
        `);

      if (fetchError) throw fetchError;

      const processedProjects = data.map(project => ({
        ...project,
        completion_percentage: calculateCompletionPercentage(project)
      }));

      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchProjects();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        fetchProjects
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [fetchProjects, supabase]);

  const calculateCompletionPercentage = (project: ProjectWithRelations): number => {
    if (!project.tasks?.length) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const groupProjects = useCallback((projects: ProjectWithRelations[], groupBy: string) => {
    const groupedProjects: { [key: string]: ProjectWithRelations[] } = {};
    const getGroupKey = groupKeyMap[groupBy as keyof typeof groupKeyMap] || groupKeyMap.status;

    projects.forEach(project => {
      const key = getGroupKey(project);
      if (!groupedProjects[key]) {
        groupedProjects[key] = [];
      }
      groupedProjects[key].push(project);
    });

    return groupedProjects;
  }, []);

  const bulkUpdateProjects = async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .in('id', projectIds);

      if (updateError) throw updateError;

      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  };

  const archiveProjects = async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived',
      updated_at: new Date().toISOString()
    });
  };

  const TAX_DEADLINES: Record<TaxReturnType, { normal: string; extended: string }> = {
    '1040': { normal: '04-15', extended: '10-15' },
    '1120': { normal: '04-15', extended: '10-15' },
    '1065': { normal: '03-15', extended: '09-15' },
    '1120S': { normal: '03-15', extended: '09-15' },
    '990': { normal: '05-15', extended: '11-15' },
    '941': { normal: 'quarterly', extended: 'N/A' },
    '940': { normal: '01-31', extended: 'N/A' },
    'other': { normal: '04-15', extended: '10-15' }
  };

  const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (new Date(deadlineDate) > today) {
        return deadlineDate;
      }
    }
    
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const getProjectDeadline = useCallback((project: ProjectWithRelations): Date | null => {
    if (project.due_date) {
      return new Date(project.due_date);
    }
    if (project.tax_info?.filing_deadline) {
      return new Date(project.tax_info.filing_deadline);
    }
    if (project.payroll_info?.next_payroll_date) {
      return new Date(project.payroll_info.next_payroll_date);
    }
    if (project.business_services_info?.due_date) {
      return new Date(project.business_services_info.due_date);
    }
    if (project.tax_info?.return_type) {
      const isExtended = project.tax_info.is_extended || false;
      return getDeadline(project.tax_info.return_type, isExtended);
    }
    return null;
  }, [getDeadline]);

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = (filters.search || '').toLowerCase();
      
      // Safely access potentially undefined properties
      const projectTitle = project?.title || '';
      const projectDesc = project?.description || '';
      const clientCompany = project?.client?.company_name || '';
      const clientName = project?.client?.full_name || '';
      const returnType = project?.tax_info?.return_type || '';
      
      const matchesSearch = !searchLower || (
        projectTitle.toLowerCase().includes(searchLower) ||
        projectDesc.toLowerCase().includes(searchLower) ||
        clientCompany.toLowerCase().includes(searchLower) ||
        clientName.toLowerCase().includes(searchLower) ||
        returnType.toLowerCase().includes(searchLower)
      );

      const matchesService = !filters.service?.length || 
        (project?.service_category && filters.service.includes(project.service_category));
      
      const matchesStatus = !filters.status?.length || 
        (project?.status && filters.status.includes(project.status));
      
      const matchesPriority = !filters.priority?.length || 
        (project?.priority && filters.priority.includes(project.priority));
      
      const matchesReturnType = !filters.returnType?.length || 
        (project?.tax_info?.return_type && filters.returnType.includes(project.tax_info.return_type));
      
      const matchesReviewStatus = !filters.reviewStatus?.length || 
        (project?.tax_info?.review_status && filters.reviewStatus.includes(project.tax_info.review_status));

      const deadline = getProjectDeadline(project);
      const matchesDueThisWeek = !filters.dueThisWeek || 
        (deadline && new Date(deadline) <= new Date(endOfWeek(new Date())));

      const matchesDueThisMonth = !filters.dueThisMonth || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 1)));

      const matchesDueThisQuarter = !filters.dueThisQuarter || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 3)));

      const matchesDateRange = !filters.dateRange || !deadline || 
        (deadline >= new Date(filters.dateRange.from) && deadline <= new Date(filters.dateRange.to));

      return (
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesPriority &&
        matchesReturnType &&
        matchesReviewStatus &&
        matchesDueThisWeek &&
        matchesDueThisMonth &&
        matchesDueThisQuarter &&
        matchesDateRange
      );
    });
  }, [filters, getProjectDeadline]);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    groupProjects,
    refresh: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}

```

### `src\components\projects\project-form.tsx`

```typescript
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
```

### `src\hooks\useWorkflows.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { 
  DbWorkflowTemplate,
  DbWorkflowTemplateInsert,
  WorkflowTemplateWithRelations,
  WorkflowStep,
  WorkflowStatus,
  WORKFLOW_STATUS
} from '@/types/workflows'

interface CreateWorkflowRequest {
  name: string
  description?: string | null
  steps: WorkflowStep[]
}

interface UseWorkflowsOptions {
  initialFilters?: {
    status?: WorkflowStatus
    search?: string
  }
  pageSize?: number
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<WorkflowTemplateWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState(options.initialFilters || {})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(options.pageSize || 10)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchWorkflows()
  }, [filters, page, pageSize])

  async function fetchWorkflows() {
    try {
      let query = supabase
        .from('workflow_templates')
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      // Execute query
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkflows(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'))
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkflow(workflowData: CreateWorkflowRequest): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: createError } = await supabase
        .from('workflow_templates')
        .insert({
          name: workflowData.name,
          description: workflowData.description,
          steps: workflowData.steps
        } satisfies DbWorkflowTemplateInsert)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (createError) throw createError

      setWorkflows(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create workflow')
      }
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<DbWorkflowTemplate>
  ): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: updateError } = await supabase
        .from('workflow_templates')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (updateError) throw updateError

      setWorkflows(prev =>
        prev.map(workflow =>
          workflow.id === id ? data : workflow
        )
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to update workflow')
      }
    }
  }

  async function deleteWorkflow(id: number): Promise<{ error: Error | null }> {
    try {
      const { error: deleteError } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting workflow:', err)
      return { 
        error: err instanceof Error ? err : new Error('Failed to delete workflow')
      }
    }
  }

  return {
    workflows,
    loading,
    error,
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
}

```

### `src\types\hooks.ts`

```typescript
import { Project, ProjectTemplate, ProjectFormValues } from './projects'
import { Task, TaskStatus, ReviewStatus } from './tasks'
import { Client } from './clients'
import { Database } from './database.types'

// Re-export database enums
export type ProjectStatus = Database['public']['Enums']['project_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type ServiceType = Database['public']['Enums']['service_type']

// Re-export all types to ensure they are available
export type {
  Project,
  ProjectTemplate,
  ProjectFormValues,
  Task,
  TaskStatus,
  ReviewStatus,
  Client,
  Database
}

export type WorkflowTemplate = {
  id: string
  name: string
  description?: string | null
  steps: Array<{
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
  }>
  created_at?: string | null
}

export type TemplateTask = {
  id: string
  title: string
  description: string
  order_index: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template_id: string
  dependencies: string[]
  created_at: string
  updated_at: string
}

export type TaxReturn = {
  id?: string
  project_id?: string
  tax_year: number
  filing_type?: string
  status?: string
  filing_deadline?: string
  extension_filed?: boolean
  created_at?: string
  updated_at?: string
}

export type WorkflowStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type WorkflowTask = Task & { workflow_id?: string }

export type ClientOnboardingWorkflow = Database['public']['Tables']['client_onboarding_workflows']['Row'] & {
  steps?: Array<{
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
}

export type Document = Database['public']['Tables']['client_documents']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'] | null
  client?: Database['public']['Tables']['clients']['Row'] | null
}

export type DocumentFormData = Omit<Document, 'id' | 'uploaded_at'>

export type Note = Database['public']['Tables']['notes']['Row']

export type PayrollService = Database['public']['Tables']['payroll_services']['Row']

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ServiceCategory = 'tax_returns' | 'payroll' | 'accounting' | 'tax_planning' | 'compliance' | 'uncategorized'

export type ProjectFilters = {
  search?: string
  service?: string[]
  serviceType?: string[]
  service_category?: string[]
  status?: string[]
  priority?: string[]
  dateRange?: { from: string; to: string }
  dueDateRange?: { from: Date; to: Date }
  clientId?: string
  teamMemberId?: string
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
  returnType?: string[]
  reviewStatus?: string[]
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
}

export type ProjectAnalytics = {
  completionRate: number
  riskLevel: string
  predictedDelay: number
  resourceUtilization: number
  recommendations: string[]
}

```

### `src\hooks\useTaxProjectManagement.ts`

```typescript
'use client'

import { useState, useCallback } from 'react';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ProjectWithRelations, TaxReturnType } from '@/types/projects';

// Constants for tax deadlines
const TAX_DEADLINES = {
  '1040': {
    normal: '04-15',
    extended: '10-15'
  },
  '1120': {
    normal: '03-15',
    extended: '09-15'
  },
  '1065': {
    normal: '03-15',
    extended: '09-15'
  },
  '1120S': {
    normal: '03-15',
    extended: '09-15'
  }
};

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

export function useTaxProjectManagement() {
  const [view, setView] = useState<'deadline' | 'return_type' | 'review_status'>('deadline');

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = startOfDay(new Date());
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (isAfter(deadlineDate, today)) {
        return deadlineDate;
      }
    }
    
    // If all deadlines have passed, return first deadline of next year
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const groupProjectsByDeadline = useCallback((projects: ProjectWithRelations[]) => {
    const groups: Record<string, ProjectWithRelations[]> = {
      'Due This Week': [],
      'Due This Month': [],
      'Due Later': [],
      'Past Due': [],
    };

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);

    projects.forEach(project => {
      if (!project.tax_info?.filing_deadline) return;

      const deadline = new Date(project.tax_info.filing_deadline);
      
      if (isBefore(deadline, today)) {
        groups['Past Due'].push(project);
      } else if (isBefore(deadline, nextWeek)) {
        groups['Due This Week'].push(project);
      } else if (isBefore(deadline, nextMonth)) {
        groups['Due This Month'].push(project);
      } else {
        groups['Due Later'].push(project);
      }
    });

    return groups;
  }, []);

  const groupProjectsByReturnType = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const returnType = project.tax_info?.return_type || 'Other';
      if (!groups[returnType]) {
        groups[returnType] = [];
      }
      groups[returnType].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReviewStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const status = project.tax_info?.review_status || 'Not Started';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  return {
    view,
    setView,
    getDeadline,
    getNextEstimatedTaxDeadline,
    groupProjectsByDeadline,
    groupProjectsByReturnType,
    groupProjectsByReviewStatus,
  };
}

```

### `src\lib\validations\schema.ts`

```typescript
import { z } from 'zod'
import { 
  CLIENT_STATUS, 
  CLIENT_TYPE, 
  FILING_TYPE 
} from '@/types/clients'
import {
  PROJECT_STATUS,
  SERVICE_TYPE
} from '@/types/projects'
import {
  TASK_STATUS,
  TASK_PRIORITY
} from '@/types/tasks'

// Client Schemas
export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  alternate_email: z.string().email().optional(),
  alternate_phone: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone']).optional(),
  notes: z.string().optional()
})

export const taxInfoSchema = z.object({
  filing_type: z.enum(FILING_TYPE),
  tax_id_type: z.enum(['ssn', 'ein']).optional(),
  tax_id: z.string().optional(),
  filing_status: z.string().optional(),
  dependents: z.array(z.object({
    name: z.string(),
    ssn: z.string().optional(),
    relationship: z.string().optional(),
    birth_date: z.string().optional()
  })).optional(),
  previous_returns: z.array(z.object({
    year: z.number(),
    filed_date: z.string(),
    preparer: z.string().optional(),
    notes: z.string().optional()
  })).optional()
})

export const clientSchema = z.object({
  contact_email: z.string().email(),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  status: z.enum(CLIENT_STATUS),
  type: z.enum(CLIENT_TYPE),
  contact_info: contactInfoSchema,
  tax_info: taxInfoSchema.nullable(),
  business_tax_id: z.string().optional(),
  individual_tax_id: z.string().optional()
})

// Project Schemas
export const projectTaxInfoSchema = z.object({
  return_type: z.enum(FILING_TYPE),
  tax_year: z.number(),
  filing_status: z.string().optional(),
  is_extension_filed: z.boolean().optional(),
  extension_date: z.string().optional(),
  documents_received: z.boolean().optional(),
  last_filed_date: z.string().optional()
})

export const accountingInfoSchema = z.object({
  fiscal_year_end: z.string().optional(),
  accounting_method: z.enum(['cash', 'accrual']).optional(),
  last_reconciliation_date: z.string().optional(),
  software: z.string().optional(),
  chart_of_accounts_setup: z.boolean().optional(),
  notes: z.string().optional()
})

export const payrollInfoSchema = z.object({
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly']).optional(),
  employee_count: z.number().optional(),
  last_payroll_date: z.string().optional(),
  next_payroll_date: z.string().optional(),
  tax_deposit_schedule: z.enum(['monthly', 'semi-weekly']).optional(),
  notes: z.string().optional()
})

export const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUS),
  service_type: z.enum(SERVICE_TYPE),
  client_id: z.string().optional(),
  primary_manager: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  end_date: z.string().optional(),
  tax_info: projectTaxInfoSchema.nullable(),
  accounting_info: accountingInfoSchema.nullable(),
  payroll_info: payrollInfoSchema.nullable(),
  service_info: z.record(z.unknown()).nullable()
})

// Task Schemas
export const taskRecurringConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number(),
  end_date: z.string().optional(),
  end_occurrences: z.number().optional()
})

export const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(TASK_STATUS),
  priority: z.enum(TASK_PRIORITY).optional(),
  project_id: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  start_date: z.string().optional(),
  progress: z.number().optional(),
  recurring_config: taskRecurringConfigSchema.nullable(),
  parent_task_id: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional()
}) 
```

### `src\components\forms\project\basic-info-form.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { Tables } from '@/types/database.types';

type Client = Tables<'clients'>;
type ProjectTemplate = Tables<'project_templates'> & {
  tasks: Tables<'template_tasks'>[];
};

interface BasicInfoFormProps {
  form: UseFormReturn<ProjectFormValues>;
  clients: Client[];
  templates?: ProjectTemplate[];
  templatesLoading?: boolean;
}

export function BasicInfoForm({ 
  form, 
  clients,
  templates = [],
  templatesLoading = false 
}: BasicInfoFormProps) {
  // Group clients by type and create appropriate labels
  const clientOptions = clients
    .sort((a, b) => {
      // Sort by type first, then by name
      if (a.type !== b.type) {
        return a.type === 'business' ? -1 : 1;
      }
      // For businesses, sort by company name
      if (a.type === 'business') {
        return (a.company_name || '').localeCompare(b.company_name || '');
      }
      // For individuals, sort by full name
      return (a.full_name || '').localeCompare(b.full_name || '');
    })
    .map(client => ({
      value: client.id,
      label: client.type === 'business' 
        ? `${client.company_name || 'Unnamed Business'}`
        : `${client.full_name || 'Unnamed Individual'}`,
      group: client.type === 'business' ? 'Business Clients' : 'Individual Clients'
    }));

  const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.title
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Project Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter project name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Business Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Business Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Individual Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Individual Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Template</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  value={value || ''}
                  onChange={onChange}
                  {...field}
                  placeholder="Enter project description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

```

### `src\middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If user is not signed in and the current path is not /auth/login,
  // redirect the user to /auth/login
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is signed in and the current path is /auth/login,
  // redirect the user to /dashboard
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

```

### `src\hooks\useClientOnboarding.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ClientOnboardingWorkflow, WorkflowTemplate } from '@/types/hooks'

export function useClientOnboarding(clientId?: string) {
  const [workflow, setWorkflow] = useState<ClientOnboardingWorkflow | null>(null)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchWorkflow()
    }
    fetchTemplates()
  }, [clientId])

  async function fetchWorkflow() {
    if (!clientId) return

    try {
      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .select('*')
        .eq('client_id', clientId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      
      // Transform the data to include steps if progress exists
      if (data) {
        const progressData = data.progress ? JSON.parse(data.progress) : null
        const workflowData: ClientOnboardingWorkflow = {
          ...data,
          steps: progressData?.steps || []
        }
        setWorkflow(workflowData)
      } else {
        setWorkflow(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('name')

      if (error) throw error
      
      // Transform the templates data to parse steps JSON
      const transformedTemplates = (data || []).map(template => ({
        ...template,
        steps: Array.isArray(template.steps) 
          ? template.steps 
          : typeof template.steps === 'string'
            ? JSON.parse(template.steps)
            : []
      })) as WorkflowTemplate[]
      
      setTemplates(transformedTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function startWorkflow(clientId: string, templateId: number) {
    try {
      if (!clientId || !templateId) {
        throw new Error('Client ID and template ID are required')
      }

      const template = templates.find(t => t.id === templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const workflowData = {
        client_id: clientId,
        template_id: templateId,
        status: 'in_progress',
        progress: JSON.stringify({
          currentStep: 0,
          totalSteps: template.steps.length,
          completedSteps: [],
          steps: template.steps.map(step => ({
            ...step,
            status: 'pending'
          }))
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .insert([workflowData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        const progressData = JSON.parse(data[0].progress || '{}')
        const workflowWithSteps: ClientOnboardingWorkflow = {
          ...data[0],
          steps: progressData.steps || []
        }
        setWorkflow(workflowWithSteps)
        return workflowWithSteps
      }
      throw new Error('Failed to start workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<Omit<ClientOnboardingWorkflow, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setWorkflow(data[0])
        return data[0]
      }
      throw new Error('Failed to update workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteWorkflow(id: number) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const { error } = await supabase
        .from('client_onboarding_workflows')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWorkflow(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    workflow,
    templates,
    loading,
    error,
    startWorkflow,
    updateWorkflow,
    deleteWorkflow,
    refresh: fetchWorkflow
  }
}

```

### `src\hooks\useProjects.ts`

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'
import type { 
  Project, 
  ProjectWithRelations, 
  ProjectTemplate, 
  ProjectStatus, 
  ServiceType 
} from '@/types/hooks'
import type { Task } from '@/types/tasks'
import { toast } from 'sonner'
import { 
  FilterState, 
  PaginationState, 
  SortingState, 
  ProjectFilters 
} from '@/types/hooks'

interface ProjectResponse<T> {
  data: T | null
  error: string | null
}

export function useProjects(initialFilters?: ProjectFilters) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {})
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 1000
  })
  const [sorting, setSorting] = useState<SortingState>({
    column: 'created_at',
    direction: 'desc'
  })
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClientComponentClient<Database>()

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients!projects_client_id_fkey (*),
        tasks!tasks_project_id_fkey (
          *,
          checklist_items(*),
          activity_log_entries(*)
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    if (filters.status?.length) {
      query = query.in('status', filters.status)
    }
    if (filters.serviceType?.length) {
      query = query.in('service_type', filters.serviceType)
    }
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters.dueDateRange) {
      query = query
        .gte('due_date', filters.dueDateRange.from.toISOString())
        .lte('due_date', filters.dueDateRange.to.toISOString())
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = pagination.pageIndex * pagination.pageSize
    const to = from + pagination.pageSize - 1
    query = query.range(from, to)

    return query
  }, [supabase, filters, pagination])

  const fetchTaxReturns = useCallback(async (projectIds: string[]): Promise<Map<string, Database['public']['Tables']['tax_returns']['Row']>> => {
    if (!projectIds.length) return new Map()

    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .in('id', projectIds)

      if (error) {
        console.error('Error fetching tax returns:', error)
        return new Map()
      }

      return new Map(data?.map(tr => [tr.id, tr]) || [])
    } catch (error) {
      console.error('Error in fetchTaxReturns:', error)
      return new Map()
    }
  }, [supabase])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const query = buildQuery()
      const { data: projectsData, error: projectsError, count } = await query

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        toast.error('Failed to load projects')
        throw projectsError
      }

      // Fetch tax returns separately for projects that have tax_return_id
      const projectsWithTaxReturns = projectsData?.filter(p => p.tax_return_id) || []
      const taxReturnsMap = await fetchTaxReturns(projectsWithTaxReturns.map(p => p.tax_return_id))

      // Combine the data
      const enrichedProjects = projectsData?.map(project => ({
        ...project,
        tax_return: project.tax_return_id ? taxReturnsMap.get(project.tax_return_id) : undefined
      })) as ProjectWithRelations[]

      setProjects(enrichedProjects)
      if (count !== null) setTotalCount(count)
    } catch (error) {
      console.error('Error in fetchProjects:', error)
      setProjects([])
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [buildQuery, fetchTaxReturns])

  const fetchTaxReturnForProject = async (projectId: string): Promise<Database['public']['Tables']['tax_returns']['Row'] | null> => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project?.tax_return_id) return null

      const { data, error } = await supabase
        .from('tax_returns')
        .select('*')
        .eq('id', project.tax_return_id)
        .single()

      if (error) {
        if (error.code === '42501') { // Permission denied
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching tax return:', error)
      return null
    }
  }

  const createProject = async (projectData: NewProject & { tasks?: Task[] }): Promise<ProjectResponse<ProjectWithRelations>> => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError

      // Handle tasks and their related items
      if (projectData.tasks?.length) {
        for (const task of projectData.tasks) {
          // Create task
          const { data: newTask, error: taskError } = await supabase
            .from('tasks')
            .insert({
              ...task,
              project_id: project.id
            })
            .select()
            .single()

          if (taskError) throw taskError

          // Create checklist items if any
          if (task.checklist_items?.length) {
            const { error: checklistError } = await supabase
              .from('checklist_items')
              .insert(
                task.checklist_items.map(item => ({
                  ...item,
                  task_id: newTask.id
                }))
              )

            if (checklistError) throw checklistError
          }

          // Add initial activity log entry
          const { error: activityError } = await supabase
            .from('activity_log_entries')
            .insert({
              task_id: newTask.id,
              type: 'created',
              details: { status: newTask.status }
            })

          if (activityError) throw activityError
        }
      }

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error: 'Failed to create project' }
    }
  }

  const updateProject = async (projectId: string, updates: UpdateProject): Promise<ProjectResponse<ProjectWithRelations>> => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (projectError) throw projectError

      await fetchProjects()
      return { data: project, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error: 'Failed to update project' }
    }
  }

  const deleteProject = async (projectId: string): Promise<{ error: string | null }> => {
    try {
      // Delete related records first
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', projectId)

      if (tasks?.length) {
        // Delete task-related records
        await Promise.all(tasks.map(task => Promise.all([
          supabase.from('checklist_items').delete().eq('task_id', task.id),
          supabase.from('activity_log_entries').delete().eq('task_id', task.id)
        ])))
      }

      // Then delete notes
      await supabase.from('notes').delete().eq('project_id', projectId)

      // Finally delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      await fetchProjects()
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error: 'Failed to delete project' }
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    totalCount,
    filters,
    setFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    createProject,
    updateProject,
    deleteProject,
    fetchTaxReturnForProject
  }
}

```

### `src\lib\utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Task } from '@/types/tasks'
import { type ProjectWithRelations } from '@/types/projects'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterTasks(tasks: Task[], filters: { dueDate?: Date }) {
  if (!filters.dueDate) return tasks
  
  return tasks.filter(task => {
    if (!task.due_date) return false
    const taskDueDate = new Date(task.due_date)
    return taskDueDate <= filters.dueDate
  })
}

export function groupTasks(tasks: Task[], groupBy: string) {
  if (!tasks?.length) return {}
  
  return tasks.reduce((groups, task) => {
    const key = task[groupBy as keyof Task] as string
    if (!key) return groups
    
    return {
      ...groups,
      [key]: [...(groups[key] || []), task]
    }
  }, {} as { [key: string]: Task[] })
}

export function calculateCompletionRate(project: ProjectWithRelations): number {
  if (!project.tasks?.length) return 0
  const completedTasks = project.tasks.filter(task => task.status === 'completed')
  return (completedTasks.length / project.tasks.length) * 100
}

export function assessProjectRisk(project: ProjectWithRelations): string {
  const completionRate = calculateCompletionRate(project)
  const dueDate = project.due_date ? new Date(project.due_date) : null
  const today = new Date()

  if (!dueDate) return 'unknown'
  if (dueDate < today && completionRate < 100) return 'high'
  if (completionRate < 50 && dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) return 'high'
  if (completionRate < 75) return 'medium'
  return 'low'
}

export function predictDelay(project: ProjectWithRelations): number {
  const completionRate = calculateCompletionRate(project)
  if (completionRate === 100) return 0

  const dueDate = project.due_date ? new Date(project.due_date) : null
  if (!dueDate) return 0

  const today = new Date()
  const remainingWork = 100 - completionRate
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  
  if (daysUntilDue <= 0) return Math.ceil(remainingWork / 10)
  return Math.max(0, Math.ceil(remainingWork / 10) - daysUntilDue)
}

export function analyzeResourceUtilization(project: ProjectWithRelations): number {
  if (!project.team_members?.length || !project.tasks?.length) return 0

  const assignedTasks = project.tasks.filter(task => task.assignee_id)
  return (assignedTasks.length / project.tasks.length) * 100
}

export function generateRecommendations(project: ProjectWithRelations): string[] {
  const recommendations: string[] = []
  const completionRate = calculateCompletionRate(project)
  const riskLevel = assessProjectRisk(project)
  const resourceUtilization = analyzeResourceUtilization(project)

  if (completionRate < 50) {
    recommendations.push('Project progress is behind schedule. Consider allocating more resources.')
  }

  if (riskLevel === 'high') {
    recommendations.push('High risk detected. Immediate attention required.')
  }

  if (resourceUtilization < 70) {
    recommendations.push('Resource utilization is low. Consider optimizing task assignments.')
  }

  if (!project.tasks?.some(task => task.priority === 'high')) {
    recommendations.push('No high-priority tasks identified. Review task prioritization.')
  }

  return recommendations
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

```

### `src\types\database.types.ts`

```typescript
﻿export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log_entries: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          id: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_details: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          id: string
          reminder_sent: boolean | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          id?: string
          reminder_sent?: boolean | null
          status: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          id?: string
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          accounting_method: string | null
          address: string | null
          assigned_preparer_id: string | null
          business_tax_id: string | null
          business_type: string | null
          city: string | null
          company_name: string | null
          contact_email: string
          created_at: string | null
          document_deadline: string | null
          email: string | null
          filing_status: string | null
          fiscal_year_end: string | null
          full_name: string | null
          id: string
          individual_tax_id: string | null
          industry_code: string | null
          last_contact_date: string | null
          last_filed_date: string | null
          next_appointment: string | null
          notes: string | null
          phone: string | null
          primary_contact_name: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id: string | null
          tax_info: Json
          tax_return_status: string | null
          tax_year: number | null
          type: Database["public"]["Enums"]["client_type"] | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          accounting_method?: string | null
          address?: string | null
          assigned_preparer_id?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string | null
          contact_email?: string
          created_at?: string | null
          document_deadline?: string | null
          email?: string | null
          filing_status?: string | null
          fiscal_year_end?: string | null
          full_name?: string | null
          id?: string
          individual_tax_id?: string | null
          industry_code?: string | null
          last_contact_date?: string | null
          last_filed_date?: string | null
          next_appointment?: string | null
          notes?: string | null
          phone?: string | null
          primary_contact_name?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tax_id?: string | null
          tax_info?: Json
          tax_return_status?: string | null
          tax_year?: number | null
          type?: Database["public"]["Enums"]["client_type"] | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      document_tracking: {
        Row: {
          document_name: string | null
          due_date: string | null
          id: string
          project_id: string | null
          reminder_sent: boolean | null
          status: string | null
        }
        Insert: {
          document_name?: string | null
          due_date?: string | null
          id: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Update: {
          document_name?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      individuals: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          tax_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          id: string
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sent_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          individual_id: string | null
          ownership_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          individual_id?: string | null
          ownership_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_services: {
        Row: {
          client_id: string | null
          created_at: string | null
          frequency: string
          id: string
          last_processed_date: string | null
          next_due_date: string | null
          progress: string | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          frequency: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          frequency?: string
          id?: string
          last_processed_date?: string | null
          next_due_date?: string | null
          progress?: string | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          id?: string
          project_defaults?: Json | null
          recurring_schedule?: string | null
          seasonal_priority?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accounting_info: Json | null
          client_id: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          end_date: string | null
          id: string
          name: string
          parent_project_id: string | null
          payroll_info: Json | null
          primary_manager: string | null
          priority: string
          service_info: Json | null
          service_type: string | null
          stage: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count: number | null
          tax_info: Json | null
          tax_return_id: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_info?: Json | null
          client_id?: string | null
          completed_tasks?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          name?: string
          parent_project_id?: string | null
          payroll_info?: Json | null
          primary_manager?: string | null
          priority?: string
          service_info?: Json | null
          service_type?: string | null
          stage?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          task_count?: number | null
          tax_info?: Json | null
          tax_return_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_tax_return"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_primary_manager_fkey"
            columns: ["primary_manager"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          depends_on: string | null
          task_id: string | null
        }
        Insert: {
          depends_on?: string | null
          task_id?: string | null
        }
        Update: {
          depends_on?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_fkey"
            columns: ["depends_on"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          checklist: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          priority: string | null
          updated_at: string | null
        }
        Insert: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          priority?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          priority?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_team: string[] | null
          assignee_id: string | null
          category: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string | null
          priority: string | null
          progress: number | null
          project_id: string | null
          recurring_config: Json | null
          start_date: string | null
          status: string
          tax_form_type: string | null
          tax_return_id: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          recurring_config?: Json | null
          start_date?: string | null
          status?: string
          tax_form_type?: string | null
          tax_return_id?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_parent_task_id"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_tasks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_returns: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          due_date: string | null
          extension_date: string | null
          filed_date: string | null
          filing_type: string
          id: string
          notes: string | null
          status: string
          tax_year: number
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type: string
          id?: string
          notes?: string | null
          status: string
          tax_year: number
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          extension_date?: string | null
          filed_date?: string | null
          filing_type?: string
          id?: string
          notes?: string | null
          status?: string
          tax_year?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_tasks: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          order_index: number | null
          priority: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          order_index?: number | null
          priority?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_template_tasks_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          projects_managed: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          projects_managed?: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          projects_managed?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          steps?: Json
        }
        Relationships: []
      }
    }
    Views: {
      project_dashboard: {
        Row: {
          assigned_team_members: string | null
          client_name: string | null
          company_name: string | null
          completed_tasks: number | null
          completion_percentage: number | null
          due_date: string | null
          id: string | null
          name: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          completed_tasks: number | null
          completion_percentage: number | null
          project_id: string | null
          project_name: string | null
          project_status: Database["public"]["Enums"]["project_status"] | null
          total_tasks: number | null
        }
        Relationships: []
      }
      user_task_load: {
        Row: {
          completed_tasks: number | null
          full_name: string | null
          in_progress_tasks: number | null
          overdue_tasks: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      archive_project: {
        Args: {
          project_id: string
        }
        Returns: undefined
      }
      are_dependencies_completed: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      clone_project_template: {
        Args: {
          template_id: string
          new_client_id: string
          new_tax_year: number
        }
        Returns: string
      }
      commit_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_project_tasks: {
        Args: {
          p_project_id: string
          p_template_id: string
        }
        Returns: undefined
      }
      create_template_category: {
        Args: {
          p_name: string
          p_description: string
        }
        Returns: string
      }
      create_template_with_tasks: {
        Args: {
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      delete_data: {
        Args: {
          table_name: string
          condition: string
        }
        Returns: string
      }
      delete_template_category: {
        Args: {
          p_id: string
        }
        Returns: boolean
      }
      exec_sql: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      execute_ddl: {
        Args: {
          ddl_command: string
        }
        Returns: string
      }
      execute_dml: {
        Args: {
          dml_command: string
        }
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_project_tasks: {
        Args: {
          project_id: string
        }
        Returns: {
          id: string
          title: string
          status: string
          priority: string
          due_date: string
          assignee_id: string
        }[]
      }
      get_workspace_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      insert_data: {
        Args: {
          target_table: string
          data: Json
        }
        Returns: string
      }
      is_authenticated_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      lca: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      lquery_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      manage_constraint: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_index: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_rls: {
        Args: {
          table_name: string
          enable: boolean
        }
        Returns: string
      }
      manage_table: {
        Args: {
          command: string
        }
        Returns: string
      }
      manage_template_category: {
        Args: {
          p_action: string
          p_id?: string
          p_name?: string
          p_description?: string
        }
        Returns: Json
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      rollback_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      text2ltree: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      update_data: {
        Args: {
          table_name: string
          data: Json
          condition: string
        }
        Returns: string
      }
      update_template_category: {
        Args: {
          p_id: string
          p_name: string
          p_description: string
        }
        Returns: boolean
      }
      update_template_with_tasks: {
        Args: {
          template_id: string
          title: string
          description: string
          default_priority: Database["public"]["Enums"]["task_priority"]
          project_defaults: Json
          template_category_id: string
          metadata: Json
          tasks: Json
        }
        Returns: {
          category: string
          category_id: string | null
          created_at: string | null
          default_priority: string | null
          description: string | null
          id: string
          project_defaults: Json | null
          recurring_schedule: string | null
          seasonal_priority: Json | null
          title: string
          updated_at: string | null
        }
      }
      validate_json_data: {
        Args: {
          data: Json
        }
        Returns: boolean
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      client_status: "active" | "inactive" | "pending" | "archived"
      client_type: "business" | "individual"
      document_status: "pending" | "uploaded" | "verified" | "rejected"
      filing_type:
        | "individual"
        | "business"
        | "partnership"
        | "corporation"
        | "s_corporation"
        | "non_profit"
      priority_level: "low" | "medium" | "high" | "urgent"
      project_status:
        | "not_started"
        | "on_hold"
        | "cancelled"
        | "todo"
        | "in_progress"
        | "review"
        | "blocked"
        | "completed"
        | "archived"
      service_type: "tax_return" | "bookkeeping" | "payroll" | "advisory"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "review" | "completed"
      tax_return_status:
        | "not_started"
        | "gathering_documents"
        | "in_progress"
        | "review"
        | "filed"
        | "amended"
      user_role: "admin" | "team_member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

```

### `src\components\tasks\task-side-panel.tsx`

```typescript
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import type { Json } from '@/types/database.types'
import { 
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  taskStatusOptions, 
  taskPriorityOptions
} from '@/types/tasks'
import { Database } from '@/types/database.types'

type ActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Insert']

type TaskWithRelationsResponse = Database['public']['Tables']['tasks']['Row'] & {
  assignee: {
    id: string
    email: string
    full_name: string
    role: Database['public']['Enums']['user_role']
  } | null
  project: {
    id: string
    name: string
  } | null
  parent_task: {
    id: string
    title: string
  } | null
  activity_log_entries: Database['public']['Tables']['activity_log_entries']['Row'][]
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  progress: z.number().min(0).max(100).optional(),
  due_date: z.date().optional(),
  start_date: z.date().optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional(),
  assignee_id: z.string().optional(),
  assigned_team: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  parent_task_id: z.string().optional()
})

interface TaskSidePanelProps {
  isOpen: boolean
  onClose: () => void
  task: TaskWithRelations | null
  projectId?: string
  onTaskUpdate?: (task: TaskWithRelations) => void
}

export function TaskSidePanel({ 
  isOpen, 
  onClose, 
  task, 
  projectId,
  onTaskUpdate
}: TaskSidePanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: (task?.status || 'todo') as TaskStatus,
      priority: (task?.priority || 'medium') as TaskPriority,
      progress: task?.progress || 0,
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      start_date: task?.start_date ? new Date(task.start_date) : undefined,
      category: task?.category || undefined,
      tax_form_type: task?.tax_form_type || undefined,
      tax_return_id: task?.tax_return_id || undefined,
      template_id: task?.template_id || undefined,
      assignee_id: task?.assignee_id || undefined,
      assigned_team: task?.assigned_team || undefined,
      dependencies: task?.dependencies || undefined,
      parent_task_id: task?.parent_task_id || undefined
    }
  })

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    setLoading(true)
    try {
      const baseData = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        progress: values.progress,
        due_date: values.due_date?.toISOString(),
        start_date: values.start_date?.toISOString(),
        project_id: projectId,
        category: values.category,
        tax_form_type: values.tax_form_type,
        tax_return_id: values.tax_return_id,
        template_id: values.template_id,
        assignee_id: values.assignee_id,
        assigned_team: values.assigned_team,
        dependencies: values.dependencies,
        parent_task_id: values.parent_task_id,
        updated_at: new Date().toISOString()
      }

      if (task) {
        // Update task
        const { data: updatedTask, error: taskError } = await supabase
          .from('tasks')
          .update(baseData)
          .eq('id', task.id)
          .select(`
            *, 
            assignee:users(id, email, full_name, role), 
            project:projects(id, name), 
            parent_task:tasks(id, title)
          `)
          .single()

        if (taskError) throw taskError

        // Add activity log entry
        const activityEntry: ActivityLogEntry = {
          task_id: task.id,
          action: 'updated',
          details: { updates: baseData } as Json
        }

        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert(activityEntry)

        if (activityError) throw activityError

        // Fetch updated task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            activity_log_entries(*)
          `)
          .eq('id', task.id)
          .single()

        if (relationsError) throw relationsError

        toast({
          title: 'Task updated',
          description: 'The task has been successfully updated.'
        })

        if (onTaskUpdate && taskWithRelations) {
          const updatedTaskWithRelations = taskWithRelations as unknown as TaskWithRelationsResponse
          onTaskUpdate({
            ...updatedTaskWithRelations,
            recurring_config: updatedTaskWithRelations.recurring_config as any,
          } as TaskWithRelations)
        }
      } else {
        // Create new task
        const { data: newTask, error: taskError } = await supabase
          .from('tasks')
          .insert({
            ...baseData,
            created_at: new Date().toISOString()
          })
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title)
          `)
          .single()

        if (taskError) throw taskError

        // Add initial activity log entry
        const activityEntry: ActivityLogEntry = {
          task_id: newTask.id,
          action: 'created',
          details: { status: newTask.status } as Json
        }

        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert(activityEntry)

        if (activityError) throw activityError

        // Fetch created task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            activity_log_entries(*)
          `)
          .eq('id', newTask.id)
          .single()

        if (relationsError) throw relationsError

        toast({
          title: 'Task created',
          description: 'The task has been successfully created.'
        })

        if (onTaskUpdate && taskWithRelations) {
          const createdTaskWithRelations = taskWithRelations as unknown as TaskWithRelationsResponse
          onTaskUpdate({
            ...createdTaskWithRelations,
            recurring_config: createdTaskWithRelations.recurring_config as any,
          } as TaskWithRelations)
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      toast({
        title: 'Error',
        description: 'There was an error saving the task.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{task ? 'Edit Task' : 'New Task'}</SheetTitle>
          <SheetDescription>
            {task ? 'Update the task details below.' : 'Create a new task by filling out the form below.'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <Form form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskStatusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskPriorityOptions.map(priority => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : task ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### `src\components\templates\create-template-dialog.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Textarea } from 'src/components/ui/textarea';
import { useProjectTemplates } from 'src/hooks/useProjectTemplates';
import { ProjectTemplateInput, SeasonalPriority, ProjectDefaults } from '@/types/projects';

const templateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['tax-return', 'bookkeeping', 'payroll', 'business-services', 'other']),
  default_priority: z.enum(['low', 'medium', 'high']).optional(),
  estimated_total_minutes: z.number().min(0),
  recurring_schedule: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one-time']).optional(),
  seasonal_priority: z.object({
    Q1: z.enum(['low', 'medium', 'high', 'critical']),
    Q2: z.enum(['low', 'medium', 'high', 'critical']),
    Q3: z.enum(['low', 'medium', 'high', 'critical']),
    Q4: z.enum(['low', 'medium', 'high', 'critical']),
  }).optional(),
})

type TemplateFormValues = z.infer<typeof templateSchema>

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const { createTemplate } = useProjectTemplates()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'other',
      default_priority: 'medium',
      estimated_total_minutes: 0,
      recurring_schedule: 'one-time',
      seasonal_priority: {
        Q1: 'medium',
        Q2: 'medium',
        Q3: 'medium',
        Q4: 'medium',
      },
    },
  })

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      setIsSubmitting(true)
      const templateInput: ProjectTemplateInput = {
        title: data.title,
        description: data.description || '',
        category: data.category,
        category_id: null,
        default_priority: data.default_priority || 'medium',
        recurring_schedule: data.recurring_schedule,
        seasonal_priority: data.seasonal_priority as SeasonalPriority,
        project_defaults: {
          estimated_total_minutes: data.estimated_total_minutes,
          recurring_schedule: data.recurring_schedule,
          seasonal_priority: data.seasonal_priority
        } as ProjectDefaults,
        template_tasks: []
      }
      await createTemplate(templateInput)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create template:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project Template</DialogTitle>
          <DialogDescription>
            Create a reusable project template for common business processes.
          </DialogDescription>
        </DialogHeader>

        <Form form={form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tax-return">Tax Return</SelectItem>
                        <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                        <SelectItem value="payroll">Payroll</SelectItem>
                        <SelectItem value="business-services">Business Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default_priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimated_total_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring_schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Schedule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Seasonal Priority</FormLabel>
              <div className="grid grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter) => (
                  <FormField
                    key={quarter}
                    control={form.control}
                    name={`seasonal_priority.${quarter}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{quarter}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Template'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

```

### `src\components\templates\template-form.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../ui/card';
import { Tables } from '@/types/database.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Minus, GripVertical } from 'lucide-react';
import { Database } from '@/types/database.types'

interface TemplateTask {
  id?: string;
  title: string;
  description?: string;
  priority: Database['public']['Enums']['task_priority'];
  dependencies: string[];
  order_index: number;
  required_skills?: string[];
}

interface TemplateFormProps {
  mode: 'create' | 'edit';
  template?: Tables<'project_templates'> & {
    tasks?: TemplateTask[];
    version?: number;
    is_archived?: boolean;
  };
  categories: Tables<'template_categories'>[];
  onSuccess: () => void;
}

interface TemplatePreview {
  total_tasks: number;
  required_skills: string[];
  dependencies: Record<string, string[]>;
}

export default function TemplateForm({
  mode,
  template,
  categories,
  onSuccess,
}: TemplateFormProps) {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    categoryId: template?.category_id || '',
    priority: template?.default_priority || 'medium' as Database['public']['Enums']['task_priority'],
    version: template?.version || 1,
    is_archived: template?.is_archived || false,
    tasks: template?.tasks || [] as TemplateTask[],
    project_defaults: template?.project_defaults || {},
    recurring_schedule: template?.recurring_schedule || null,
    seasonal_priority: template?.seasonal_priority || null,
  });

  const [newTask, setNewTask] = useState('');
  const [templatePreview, setTemplatePreview] = useState<TemplatePreview>({
    total_tasks: 0,
    required_skills: [],
    dependencies: {}
  });

  useEffect(() => {
    // Calculate template preview stats
    const totalTasks = formData.tasks.length;
    const requiredSkills = Array.from(new Set(
      formData.tasks.flatMap(task => task.required_skills || [])
    ));
    const dependencies = formData.tasks.reduce((acc, task) => {
      if (task.dependencies && task.dependencies.length > 0) {
        acc[task.title] = task.dependencies;
      }
      return acc;
    }, {} as Record<string, string[]>);

    setTemplatePreview({
      total_tasks: totalTasks,
      required_skills: requiredSkills,
      dependencies: dependencies
    });
  }, [formData.tasks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const url = mode === 'create'
        ? '/api/templates'
        : `/api/templates/${template?.id}`;
        
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(mode === 'edit' && { id: template?.id }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      // TODO: Add error notification
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskData: TemplateTask = {
        title: newTask,
        priority: 'medium',
        dependencies: [],
        order_index: formData.tasks.length,
        required_skills: []
      };
      
      setFormData({
        ...formData,
        tasks: [...formData.tasks, newTaskData],
      });
      setNewTask('');
    }
  };

  const updateTask = (index: number, field: keyof TemplateTask, value: string | number | string[] | undefined) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setFormData({
      ...formData,
      tasks: updatedTasks
    });
  };

  const removeTask = (index: number) => {
    const updatedTasks = formData.tasks.filter((task: TemplateTask, i: number) => i !== index);
    setFormData({
      ...formData,
      tasks: updatedTasks,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Template Title
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select
              value={formData.categoryId}
              onValueChange={(value: string) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">Tasks</label>
        <div className="space-y-3">
          {formData.tasks.map((task: TemplateTask, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  className="flex-1"
                  placeholder="Task title"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={task.priority}
                    onValueChange={(value) => updateTask(index, 'priority', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Required Skills</label>
                <Input
                  value={task.required_skills?.join(', ') || ''}
                  onChange={(e) => updateTask(index, 'required_skills', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Comma separated skills"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Dependencies</label>
                <Input
                  value={task.dependencies?.join(', ') || ''}
                  onChange={(e) => updateTask(index, 'dependencies', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Comma separated task titles"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <Input
              value={newTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
              placeholder="Add new task"
              className="flex-1"
            />
            <Button type="button" onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Total Tasks</label>
              <div className="text-lg font-semibold">
                {templatePreview.total_tasks}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Required Skills</label>
              <div className="text-lg font-semibold">
                {templatePreview.required_skills.join(', ') || 'None'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Task Dependencies</label>
              <div className="space-y-1">
                {Object.entries(templatePreview.dependencies).map(([task, deps]) => (
                  <div key={task} className="text-sm">
                    {task}: {deps.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                ...formData,
                is_archived: !formData.is_archived
              });
            }}
          >
            {formData.is_archived ? 'Unarchive' : 'Archive'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                ...formData,
                version: formData.version + 1
              });
            }}
          >
            Create New Version
          </Button>
        </div>
        <Button type="submit">
          {mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

```

### `src\components\ui\sidebar.tsx`

```typescript
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

```


## File Size Analysis

| File | Size (KB) |
|------|------------|
| src/types/database.types.ts | 51.4 |
| src\components\ui\sidebar.tsx | 22.8 |
| src\components\templates\template-form.tsx | 11.9 |
| src\components\tasks\task-side-panel.tsx | 11.8 |
| src\components\templates\create-template-dialog.tsx | 10.1 |
| src/hooks/useProjectManagement.ts | 10.0 |
| src/hooks/useProjects.ts | 8.4 |
| src/components/clients/client-form.tsx | 7.4 |
| src/components/forms/project/basic-info-form.tsx | 5.7 |
| src/hooks/useClientOnboarding.ts | 4.9 |
| src/hooks/useWorkflows.ts | 4.5 |
| src/lib/utils.ts | 4.1 |
| src/lib/validations/schema.ts | 4.0 |
| src/hooks/useTaxProjectManagement.ts | 3.4 |
| src/components/tasks/task-form.tsx | 3.2 |
| src/types/hooks.ts | 3.1 |
| src/components/projects/project-form.tsx | 2.4 |
| src/middleware.ts | 2.0 |
