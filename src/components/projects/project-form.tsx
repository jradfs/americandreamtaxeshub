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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProjectWithRelations } from '@/types/projects';

const projectSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
  description: z.string().optional(),
  client_id: z.string().min(1, "Client is required"),
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
  }).optional()
});

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const supabase = createClientComponentClient();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      setIsLoading(true);

      const projectData = {
        name: values.name,
        description: values.description,
        client_id: values.client_id,
        status: values.status,
        priority: values.priority,
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type,
        tax_info: values.tax_info,
        accounting_info: values.accounting_info,
        payroll_info: values.payroll_info
      };

      let error;
      if (project?.id) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([projectData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(project?.id ? 'Project updated successfully' : 'Project created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  const watchedServiceType = form.watch('service_type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        {watchedServiceType === 'tax_returns' && (
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
  );
}
