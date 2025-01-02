'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ProjectWithRelations } from '@/types/projects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjectTemplates } from '@/hooks/useProjectTemplates';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import { useTaskValidation } from '@/hooks/useTaskValidation';
import { useProjectSubmission } from '@/hooks/useProjectSubmission';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { useProjectForm } from '@/hooks/useProjectForm';
import { Loader2 } from '@/components/ui/loader';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Label } from '@/components/ui/dialog';

interface ProjectTemplate {
  id: string
  title: string
  description: string | null
  default_priority: Database['public']['Enums']['task_priority']
  project_defaults: Record<string, unknown>
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
  const {
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
    validateServiceSpecificFields
  } = useProjectForm({
    onSuccess,
    initialData: project
  });

  const { submitProject, isSubmitting } = useProjectSubmission(onSuccess);
  const watchedServiceType = form.watch('service_type');
  const watchedTasks = form.watch('tasks') || [];
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dependencies: [],
    assigned_to: undefined
  });

  const getTabProgress = (tab: string): number => {
    const fields = {
      'basic-info': ['name', 'description'],
      'service-details': ['service_type', 'tax_return_id', 'tax_return_status', 'accounting_period'],
      'timeline-team': ['due_date', 'team_members', 'tasks']
    }[tab] || [];

    const filledFields = fields.filter(field => {
      const value = form.watch(field);
      return value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== '');
    });

    return Math.round((filledFields.length / fields.length) * 100);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    if (!validateServiceSpecificFields()) {
      toast.error('Please fill in all required fields for the selected service type');
      return;
    }
    await submitProject(values);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    
    if (fromIndex === toIndex) return;
    
    reorderTasks(fromIndex, toIndex);
  };

  const getTaxReturnOptions = () => {
    return taxReturns.map(tr => ({
      value: tr.id,
      label: tr.name
    }));
  };

  const getTeamMemberOptions = () => {
    return teamMembers.map(member => ({
      value: member.id,
      label: member.name,
      description: member.role
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <div className="flex items-center gap-4">
            <Progress value={formProgress} className="w-[100px]" />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
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
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Template</FormLabel>
                    <Select
                      onValueChange={handleTemplateChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
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

                {selectedTemplate.tasks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Template Tasks</h3>
                    <div className="space-y-2">
                      {selectedTemplate.tasks.map((task) => (
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
                        <Input {...field} placeholder="Enter project name" />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                      <Select
                        onValueChange={handleServiceTypeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax return" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getTaxReturnOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
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
                      name="tax_return_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="review_needed">Review Needed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <CardTitle>Timeline & Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
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
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="team_members"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Members</FormLabel>
                        <FormControl>
                          <MultiSelect
                            selected={field.value || []}
                            onChange={handleTeamMemberChange}
                            options={getTeamMemberOptions()}
                            placeholder="Select team members"
                          />
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
                  <DragDropContext onDragEnd={handleDragEnd}>
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
                                          {task.assigned_to && (
                                            <Badge variant="outline">
                                              {teamMembers.find(m => m.id === task.assigned_to)?.name}
                                            </Badge>
                                          )}
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
      </form>
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
                onValueChange={(value) =>
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
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select
                value={newTask.assigned_to}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, assigned_to: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {getTeamMemberOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  assigned_to: undefined
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
