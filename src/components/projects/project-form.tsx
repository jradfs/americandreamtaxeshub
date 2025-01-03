'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, GripVertical, Loader2 } from 'lucide-react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useProjectTemplates } from '@/hooks/useProjectTemplates';
import { useTaskValidation } from '@/hooks/useTaskValidation';
import { useProjectSubmission } from '@/hooks/useProjectSubmission';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import { MultiSelect } from '@/components/ui/multi-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Database } from '@/types/database.types';
import { taxReturns, teamMembers } from '@/lib/data';
import { ClientCombobox } from '@/components/clients/client-combobox'

interface ProjectTemplate {
  id: string
  title: string
  description: string | null
  default_priority: Database['public']['Enums']['task_priority']
  project_defaults: Record<string, unknown>
  template_tasks: TemplateTask[]
}

interface TemplateTask {
  id: string
  title: string
  description: string | null
  priority: Database['public']['Enums']['task_priority']
  dependencies: string[]
  order_index: number
}

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { submitProject, isSubmitting: isSubmittingForm } = useProjectSubmission(onSuccess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      creation_type: 'custom',
      template_id: null,
      name: '',
      description: '',
      client_id: '',
      status: 'not_started',
      priority: 'medium',
      service_type: undefined,
      due_date: undefined,
      tax_info: {},
      accounting_info: {},
      payroll_info: {},
      tasks: [],
      team_members: []
    }
  });

  const {
    clients,
    templates,
    selectedTemplate,
    formProgress,
    handleServiceTypeChange,
    handleTemplateChange,
    addTask,
    removeTask,
    updateTask,
    reorderTasks,
    getTaskValidationError,
    taskDependencyErrors,
    validateServiceSpecificFields,
    getTaxReturnOptions,
    getUserOptions,
    handleAssigneeChange,
    currentUser
  } = useProjectForm({
    onSuccess,
    initialData: project
  });

  const watchedServiceType = form.watch('service_type');
  const watchedTasks = form.watch('tasks') || [];
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dependencies: [],
    assignee_id: currentUser?.id
  });

  useEffect(() => {
    setNewTask(prev => ({
      ...prev,
      assignee_id: currentUser?.id
    }));
  }, [currentUser]);

  const getTabProgress = (tab: string): number => {
    const fields = {
      'client-info': ['client_id', 'service_type'],
      'project-details': ['name', 'description', 'priority', 'due_date'],
      'timeline': ['tasks'],
      'service-specific': []
    };

    if (form.getValues('service_type') === 'tax_return') {
      fields['service-specific'] = ['tax_return_id', 'tax_info.type'];
    } else if (form.getValues('service_type') === 'accounting') {
      fields['service-specific'] = ['accounting_info.frequency'];
    } else if (form.getValues('service_type') === 'payroll') {
      fields['service-specific'] = ['payroll_info.frequency'];
    }

    const tabFields = fields[tab as keyof typeof fields] || [];
    if (!tabFields.length) return 100;

    const completedFields = tabFields.filter(field => {
      const value = form.getValues(field);
      return value !== undefined && value !== '' && value !== null;
    });

    return Math.round((completedFields.length / tabFields.length) * 100);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    if (fromIndex === toIndex) return;

    reorderTasks(fromIndex, toIndex);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (!validateServiceSpecificFields()) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Format the data before sending
      const formattedData = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : null,
        tax_info: values.tax_info || {},
        accounting_info: values.accounting_info || {},
        payroll_info: values.payroll_info || {},
        status: 'not_started' as const,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      const result = await response.json();
      toast.success('Project created successfully');
      
      // Navigate to the new project
      window.location.href = `/projects/${result.id}`;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <div className="flex items-center gap-4">
            <Progress value={formProgress} className="w-[100px]" />
            <Button type="submit" disabled={isSubmitting || isSubmittingForm}>
              {isSubmitting || isSubmittingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client & Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <ClientCombobox 
                        value={field.value} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Creation Method</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === 'custom') {
                          handleTemplateChange(null);
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose how to create your project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template">Use a Template</SelectItem>
                        <SelectItem value="custom">Create from Scratch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose whether to start from a template or create a custom project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('creation_type') === 'template' && (
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Template</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTemplateChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Description:</span>{' '}
                    {selectedTemplate.description}
                  </div>
                  <div>
                    <span className="font-medium">Default Priority:</span>{' '}
                    {selectedTemplate.default_priority}
                  </div>
                </div>

                {selectedTemplate.template_tasks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Template Tasks</h3>
                    <div className="space-y-2">
                      {selectedTemplate.template_tasks.map((task) => (
                        <div key={task.title} className="p-2 border rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            {getTaskValidationError(task.title) && (
                              <Badge variant="destructive">
                                {getTaskValidationError(task.title)}
                              </Badge>
                            )}
                          </div>
                          {task.dependencies?.length > 0 && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              Depends on: {task.dependencies.join(', ')}
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic-info" className="relative">
              Basic Information
              <Progress value={getTabProgress('basic-info')} className="absolute bottom-0 left-0 h-1" />
            </TabsTrigger>
            <TabsTrigger value="service-details" className="relative">
              Service Details
              <Progress value={getTabProgress('service-details')} className="absolute bottom-0 left-0 h-1" />
            </TabsTrigger>
            <TabsTrigger value="timeline-team" className="relative">
              Timeline & Team
              <Progress value={getTabProgress('timeline-team')} className="absolute bottom-0 left-0 h-1" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
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
                        <Input
                          {...field}
                          placeholder="Enter project name"
                        />
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
                        <Textarea
                          {...field}
                          placeholder="Enter project description"
                          className="min-h-[100px]"
                        />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-details">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleServiceTypeChange(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tax_return">Tax Return</SelectItem>
                            <SelectItem value="accounting">Accounting</SelectItem>
                            <SelectItem value="payroll">Payroll</SelectItem>
                            <SelectItem value="business_services">Business Services</SelectItem>
                            <SelectItem value="irs_representation">IRS Representation</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="uncategorized">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedServiceType === 'tax_return' && (
                  <>
                    <FormField
                      control={form.control}
                      name="tax_return_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Return</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax return" />
                              </SelectTrigger>
                              <SelectContent>
                                {getTaxReturnOptions().map((option) => (
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
                      name="tax_return_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_started">Not Started</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="review_needed">Review Needed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {watchedServiceType === 'accounting' && (
                  <FormField
                    control={form.control}
                    name="accounting_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accounting Period</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline-team">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !form.getValues('due_date') && 'text-muted-foreground'
                                )}
                              >
                                {form.getValues('due_date') ? (
                                  format(form.getValues('due_date'), 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={form.getValues('due_date')}
                                onSelect={(date) => form.setValue('due_date', date)}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowTaskDialog(true)}
                  >
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tasks">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {watchedTasks.map((task, index) => (
                            <Draggable
                              key={task.title}
                              draggableId={task.title}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="p-4 mb-2 border rounded-lg bg-card"
                                >
                                  <div className="flex items-start gap-4">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1.5"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{task.title}</h4>
                                        <div className="flex items-center gap-2">
                                          <Badge>{task.priority}</Badge>
                                          {task.assignee_id && (
                                            <Badge variant="outline">
                                              {getUserOptions().find(u => u.value === task.assignee_id)?.label}
                                            </Badge>
                                          )}
                                          <Select
                                            value={task.assignee_id}
                                            onChange={(value) => handleAssigneeChange(index, value)}
                                          >
                                            <SelectTrigger className="w-[180px]">
                                              <SelectValue placeholder="Assign to..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getUserOptions().map((user) => (
                                                <SelectItem key={user.value} value={user.value}>
                                                  {user.full_name} ({user.email})
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTask(task.title)}
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                      {task.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {task.description}
                                        </p>
                                      )}
                                      {task.dependencies?.length > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                          Depends on: {task.dependencies.join(', ')}
                                        </div>
                                      )}
                                      {getTaskValidationError(task.title) && (
                                        <p className="text-sm text-destructive">
                                          {getTaskValidationError(task.title)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Enter task description"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newTask.priority}
                onChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select
                value={newTask.assignee_id}
                onChange={(value) =>
                  setNewTask({ ...newTask, assignee_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {getUserOptions().map((user) => (
                    <SelectItem key={user.value} value={user.value}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dependencies</Label>
              <MultiSelect
                selected={newTask.dependencies || []}
                onChange={(value) =>
                  setNewTask({ ...newTask, dependencies: value })
                }
                options={watchedTasks.map((task) => ({
                  value: task.title,
                  label: task.title
                }))}
                placeholder="Select dependencies"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newTask.title) {
                  toast.error('Task title is required');
                  return;
                }
                if (watchedTasks.some(t => t.title === newTask.title)) {
                  toast.error('Task title must be unique');
                  return;
                }
                addTask(newTask);
                setShowTaskDialog(false);
                setNewTask({
                  title: '',
                  description: '',
                  priority: 'medium',
                  dependencies: [],
                  assignee_id: currentUser?.id
                });
              }}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
