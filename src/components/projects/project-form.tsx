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

// Keep the projectSchema definition as is
const projectSchema = z.object({
  // ... (keep existing schema)
});

interface ProjectFormProps {
  project?: ProjectWithRelations;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  // Keep all the existing state and hooks
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

  // Keep the useEffect hooks as is
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

  // Keep the onSubmit function as is
  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    // ... (keep existing implementation)
  };

  const watchedServiceType = form.watch('service_type');

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
