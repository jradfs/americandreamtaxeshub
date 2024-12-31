'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload, FileText, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProjectWithRelations } from '@/types/projects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProjectTemplates } from '@/hooks/useProjectTemplates';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  client_id: z.string().min(1, 'Client is required'),
  status: z.string().default('not_started'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.date().optional(),
  service_type: z.enum([
    'tax_returns', 
    'accounting', 
    'payroll', 
    'business_services', 
    'irs_representation', 
    'consulting', 
    'uncategorized'
  ]).default('uncategorized'),
  template_id: z.string().optional(),
  tasks: z.array(z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    dependencies: z.array(z.string()).optional()
  })).optional()
}).refine(data => {
  // Validate that if template_id is provided, tasks must exist
  if (data.template_id && !data.tasks?.length) {
    return false;
  }
  return true;
}, {
  message: "Template tasks are required when using a template",
  path: ["tasks"]
});

interface ProjectTemplate {
  id: string;
  title: string;
  description: string | null;
  default_priority: string;
}

interface TemplateTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  dependencies: string[];
  order_index: number;
}

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const supabase = createClientComponentClient();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [formProgress, setFormProgress] = useState(0);
  const { templates, loading: templatesLoading } = useProjectTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [templateTasks, setTemplateTasks] = useState<any[]>([]);
  const [taskDependencyErrors, setTaskDependencyErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkStorageAccess = async () => {
      try {
        // Test both projects and tasks table access
        const [{ error: projectsError }, { error: tasksError }] = await Promise.all([
          supabase.from('projects').select('*').limit(1),
          supabase.from('tasks').select('*').limit(1)
        ]);

        if (projectsError || tasksError) {
          throw projectsError || tasksError;
        }
      } catch (error) {
        console.error('Storage access error:', error);
        toast.error({
          title: 'Permission Error',
          description: 'Failed to access storage. Please check your permissions and try again.',
          variant: 'destructive'
        });
      }
    };

    checkStorageAccess();
  }, [supabase]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      client_id: project?.client?.id || '',
      status: project?.status || 'not_started',
      priority: project?.priority || 'medium',
      due_date: project?.due_date ? new Date(project.due_date) : undefined,
      service_type: project?.service_type || 'uncategorized',
      template_id: project?.template_id || undefined,
      tasks: []
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select('*')
        .order('company_name');

      if (error) {
        toast.error('Failed to load clients');
        return;
      }

      setClients(clientsData || []);
    };

    fetchClients();
  }, [supabase]);

  useEffect(() => {
    const requiredFields = ['name', 'client_id', 'service_type', 'priority'];
    const completedFields = requiredFields.filter(field => {
      const value = form.getValues(field);
      return value !== null && value !== undefined && value !== '';
    });
    const progress = (completedFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [form.watch()]);

  const validateTaskDependencies = (tasks: any[]) => {
    const errors: Record<string, string> = {};
    const taskMap = new Map<string, string>(); // id -> title
    tasks.forEach(task => {
      taskMap.set(task.id, task.title);
      if (task.title) {
        taskMap.set(task.title.toLowerCase(), task.id);
      }
    });

    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach((dep: string) => {
          // Check if dependency exists in the map
          if (!taskMap.has(dep) && !taskMap.has(dep.toLowerCase())) {
            errors[task.id] = `Dependency "${dep}" not found`;
          }
          
          // Check for circular dependencies
          const depId = taskMap.get(dep.toLowerCase()) || dep;
          if (task.id === depId) {
            errors[task.id] = `Task cannot depend on itself`;
          }
        });
      }
    });

    setTaskDependencyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (!validateTaskDependencies(values.tasks || [])) {
      toast.error('Please fix task dependency errors');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare project data with defaults
      const projectData = {
        name: values.name,
        description: values.description,
        client_id: values.client_id,
        status: values.status || 'not_started',
        priority: values.priority || 'medium',
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type || 'uncategorized',
        template_id: values.template_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert tasks if template was used
      if (values.template_id && values.tasks?.length) {
        const tasksData = values.tasks.map(task => ({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dependencies: task.dependencies?.map(dep => {
            // Convert dependency titles to IDs if needed
            const matchingTask = values.tasks?.find(t => 
              t.title.toLowerCase() === dep.toLowerCase() || t.id === dep
            );
            return matchingTask?.id || dep;
          }),
          project_id: project.id,
          status: 'not_started',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksData);

        if (tasksError) throw tasksError;
      }

      toast.success('Project created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedServiceType = form.watch('service_type');

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Project Details</h2>
                    <Badge variant={formProgress === 100 ? "default" : "secondary"}>
                {formProgress === 100 ? "Complete" : "In Progress"}
              </Badge>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          <FormField
            control={form.control}
            name="template_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template</FormLabel>
                <Select
                  onValueChange={async (value) => {
                    const template = templates.find(t => t.id === value);
                    setSelectedTemplate(template || null);
                    field.onChange(value);
                    if (template) {
                      form.setValue('name', template.title);
                      form.setValue('description', template.description);
                      form.setValue('priority', template.default_priority);

                      // Fetch template tasks
                      const { data: tasks, error } = await supabase
                        .from('template_tasks')
                        .select('*')
                        .eq('template_id', template.id)
                        .order('order_index');
                      
                      if (error) {
                        toast.error('Failed to load template tasks');
                        return;
                      }
                      setTemplateTasks(tasks || []);
                      form.setValue('tasks', tasks?.map(task => ({
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        dependencies: task.dependencies
                      })) || []);
                    } else {
                      setTemplateTasks([]);
                      form.setValue('tasks', []);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {templatesLoading && <SelectItem value="loading" disabled>Loading templates...</SelectItem>}
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a template to pre-fill project details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name || client.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tax_returns">Tax Returns</SelectItem>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="business_services">Business Services</SelectItem>
                      <SelectItem value="irs_representation">IRS Representation</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => {
                // Ensure value is never null
                const value = field.value || 'medium';
                return (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue('priority', val);
                      }}
                      value={value}
                      defaultValue="medium"
                    >
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
                );
              }}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Description:</span> {selectedTemplate.description}
                  </div>
                  <div>
                    <span className="font-medium">Default Priority:</span> {selectedTemplate.default_priority}
                  </div>
                </div>
                
                {templateTasks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Template Tasks</h3>
                    <div className="space-y-2">
                      {templateTasks.map((task, index) => (
                        <div key={task.id} className="p-2 border rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentTasks = form.getValues('tasks') || [];
                                const updatedTasks = currentTasks.filter(t => t.title !== task.title);
                                form.setValue('tasks', updatedTasks);
                                setTemplateTasks(prev => prev.filter(t => t.id !== task.id));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          {task.dependencies && task.dependencies.length > 0 && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              Depends on: {task.dependencies.join(', ')}
                            </div>
                          )}
                          {taskDependencyErrors[task.id] && (
                            <div className="text-sm text-destructive mt-1">
                              {taskDependencyErrors[task.id]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
              <TabsTrigger value="service-details">Service Details</TabsTrigger>
              <TabsTrigger value="timeline-team">Timeline & Team</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info">
              <Card>
                {/* Keep the existing CardHeader and CardContent */}
              </Card>
            </TabsContent>

            <TabsContent value="service-details">
              {watchedServiceType === 'tax_returns' && (
                <>
                  {/* Keep the existing tax returns content */}
                </>
              )}

              {watchedServiceType === 'accounting' && (
                <>
                  {/* Keep the existing accounting content */}
                </>
              )}

              {watchedServiceType === 'payroll' && (
                <>
                  {/* Keep the existing payroll content */}
                </>
              )}
            </TabsContent>

            <TabsContent value="timeline-team">
              <Card>
                {/* Keep the existing team & timeline content */}
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (project?.id ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </Form>
    </ErrorBoundary>
  );
}
