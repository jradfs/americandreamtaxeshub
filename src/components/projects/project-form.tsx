'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
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

const projectSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
  description: z.string().optional(),
  client_id: z.string().min(1, "Client is required"),
  template_id: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'waiting_for_info', 'needs_review', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.date().optional(),
  service_type: z.enum(['tax_returns', 'accounting', 'payroll', 'business_services', 'irs_representation', 'consulting', 'uncategorized']),
  tax_info: z.object({
    return_type: z.enum(['1040', '1120', '1065', '1120S', '990', '941', '940', 'other']),
    tax_year: z.number(),
    extension_filed: z.boolean().optional(),
    missing_documents: z.array(z.string()).optional(),
    review_status: z.enum(['not_started', 'in_progress', 'needs_review', 'reviewed', 'approved', 'rejected']).optional(),
    estimated_refund: z.number().optional(),
    estimated_balance_due: z.number().optional()
  }).optional(),
  accounting_info: z.object({
    service_type: z.enum(['bookkeeping', 'financial_statements', 'audit', 'other']),
    frequency: z.enum(['monthly', 'quarterly', 'annual', 'one_time']),
    software_used: z.string().optional()
  }).optional(),
  payroll_info: z.object({
    frequency: z.enum(['weekly', 'bi_weekly', 'semi_monthly', 'monthly']),
    employee_count: z.number().optional(),
    software_used: z.string().optional()
  }).optional(),
  documents: z.array(z.object({
    name: z.string(),
    status: z.enum(['pending', 'received', 'reviewed']),
    required: z.boolean(),
    notes: z.string().optional()
  })).optional(),
  team_members: z.array(z.string()).optional(),
  milestones: z.array(z.object({
    title: z.string(),
    due_date: z.date(),
    completed: z.boolean()
  })).optional()
});

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const supabase = createClientComponentClient();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [formProgress, setFormProgress] = useState(0);
  const { templates } = useProjectTemplates();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      client_id: project?.client_id || '',
      status: project?.status || 'not_started',
      priority: project?.priority || 'medium',
      due_date: project?.due_date ? new Date(project.due_date) : undefined,
      service_type: project?.service_type || 'uncategorized',
      tax_info: project?.tax_info,
      accounting_info: project?.accounting_info,
      payroll_info: project?.payroll_info
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
    const requiredFields = ['name', 'client_id', 'service_type'];
    const completedFields = requiredFields.filter(field => form.getValues(field));
    const progress = (completedFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [form.watch()]);

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsLoading(true);
    try {
      const projectData = {
        ...values,
        due_date: values.due_date?.toISOString(),
      };

      let result;
      if (project) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        result = data;

        // If template is selected, create template tasks
        if (values.template_id) {
          const { data: templateTasks, error: tasksError } = await supabase
            .from('template_tasks')
            .select('*')
            .eq('template_id', values.template_id)
            .order('order_index');

          if (tasksError) throw tasksError;

          if (templateTasks?.length) {
            const projectTasks = templateTasks.map(task => ({
              project_id: result.id,
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: 'todo'
            }));

            const { error: insertError } = await supabase
              .from('tasks')
              .insert(projectTasks);

            if (insertError) throw insertError;
          }
        }
      }

      toast.success(project ? 'Project updated successfully' : 'Project created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  const watchedServiceType = form.watch('service_type');

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Project Details</h2>
            <Badge variant={formProgress === 100 ? "success" : "secondary"}>
              {formProgress === 100 ? "Complete" : "In Progress"}
            </Badge>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
            <TabsTrigger value="service-details">Service Details</TabsTrigger>
            <TabsTrigger value="timeline-team">Timeline & Team</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Template</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Pre-fill form with template data
                          const template = templates?.find(t => t.id === value);
                          if (template) {
                            form.setValue('name', template.title);
                            form.setValue('description', template.description || '');
                            form.setValue('priority', template.default_priority || 'medium');
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates?.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a template to pre-fill project details and tasks
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client: any) => (
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Project description (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="waiting_for_info">Waiting for Info</SelectItem>
                            <SelectItem value="needs_review">Needs Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
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
                              disabled={(date) =>
                                date < new Date('1900-01-01')
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
              </CardContent>
            </Card>
            <TabsContent value="service-details" className="space-y-4">
              {watchedServiceType === 'tax_returns' && (
                <>
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="font-medium">Tax Return Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tax_info.return_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Return Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select return type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1040">1040 - Individual</SelectItem>
                                <SelectItem value="1120">1120 - C Corporation</SelectItem>
                                <SelectItem value="1120S">1120S - S Corporation</SelectItem>
                                <SelectItem value="1065">1065 - Partnership</SelectItem>
                                <SelectItem value="990">990 - Non-Profit</SelectItem>
                                <SelectItem value="941">941 - Quarterly Employment</SelectItem>
                                <SelectItem value="940">940 - Annual FUTA</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <Input 
                                type="number" 
                                placeholder="Enter tax year"
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Required Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {form.watch('tax_info.return_type') === '1040' && (
                          <>
                            <FormField
                              control={form.control}
                              name="documents"
                              render={({ field }) => (
                                <div className="space-y-2">
                                  {['W-2s', 'Form 1099s', 'Mortgage Interest Statements'].map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <span>{doc}</span>
                                      <Select
                                        value={field.value?.[index]?.status || 'pending'}
                                        onValueChange={(value) => {
                                          const newDocs = [...(field.value || [])];
                                          newDocs[index] = { name: doc, status: value, required: true };
                                          field.onChange(newDocs);
                                        }}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="received">Received</SelectItem>
                                          <SelectItem value="reviewed">Reviewed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {watchedServiceType === 'accounting' && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-medium">Accounting Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="accounting_info.service_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                              <SelectItem value="financial_statements">Financial Statements</SelectItem>
                              <SelectItem value="audit">Audit</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accounting_info.frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="one_time">One Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {watchedServiceType === 'payroll' && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-medium">Payroll Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payroll_info.frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                              <SelectItem value="semi_monthly">Semi-Monthly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payroll_info.employee_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Employees</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter employee count"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline-team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="team_members"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Members</FormLabel>
                          <FormControl>
                            <Select
                              multiple
                              value={field.value || []}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select team members" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member1">John Doe</SelectItem>
                                <SelectItem value="member2">Jane Smith</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <FormLabel>Milestones</FormLabel>
                      <FormField
                        control={form.control}
                        name="milestones"
                        render={({ field }) => (
                          <div className="space-y-2">
                            {(field.value || []).map((milestone, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                <Input
                                  placeholder="Milestone title"
                                  value={milestone.title}
                                  onChange={(e) => {
                                    const newMilestones = [...field.value];
                                    newMilestones[index] = { ...milestone, title: e.target.value };
                                    field.onChange(newMilestones);
                                  }}
                                />
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline">
                                      {milestone.due_date ? format(milestone.due_date, 'PP') : 'Select date'}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={milestone.due_date}
                                      onSelect={(date) => {
                                        const newMilestones = [...field.value];
                                        newMilestones[index] = { ...milestone, due_date: date };
                                        field.onChange(newMilestones);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([
                                  ...(field.value || []),
                                  { title: '', due_date: new Date(), completed: false }
                                ]);
                              }}
                            >
                              Add Milestone
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
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
      </div>
    </div>
  );
}
