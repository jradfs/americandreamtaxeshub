'use client';

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ClientCombobox } from "@/components/clients/client-combobox";
import { TemplateCombobox } from "@/components/templates/template-combobox";
import { useProjectTemplates } from "@/hooks/useProjectTemplates";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "completed", "on_hold"]),
  priority: z.enum(["low", "medium", "high"]),
  client_id: z.string().optional(),
  due_date: z.string().optional(),
  start_date: z.string().optional(),
  estimated_hours: z.coerce.number().positive().optional(),
  stage: z.string().optional(),
  template_id: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: ProjectFormValues & { id: string };
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function ProjectForm({ project, onSuccess, mode = 'create' }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { templates } = useProjectTemplates();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
      ...project,
    },
  });

  // Handle template selection
  const handleTemplateSelect = async (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      form.setValue('name', template.title);
      form.setValue('description', template.description || '');
      form.setValue('estimated_hours', 
        template.estimated_total_minutes 
          ? Math.ceil(template.estimated_total_minutes / 60) 
          : undefined
      );
      form.setValue('priority', template.default_priority as "low" | "medium" | "high" || 'medium');
      form.setValue('template_id', template.id);
    }
  };

  async function onSubmit(data: ProjectFormValues) {
    setLoading(true);
    try {
      let projectId: string;
      
      if (mode === 'edit' && project?.id) {
        const { error } = await supabase
          .from("projects")
          .update(data)
          .eq('id', project.id);
        if (error) throw error;
        projectId = project.id;
      } else {
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        projectId = newProject.id;

        // If template is selected, create template tasks
        if (data.template_id) {
          const { data: templateTasks, error: tasksError } = await supabase
            .from('template_tasks')
            .select('*')
            .eq('template_id', data.template_id)
            .order('order_index');

          if (tasksError) throw tasksError;

          if (templateTasks?.length) {
            const projectTasks = templateTasks.map(task => ({
              project_id: projectId,
              title: task.title,
              description: task.description,
              // Convert task's estimated minutes to hours
              estimated_hours: task.estimated_minutes 
                ? Math.round(task.estimated_minutes / 60 * 100) / 100 // Convert minutes to hours with 2 decimal places
                : null,
              priority: task.priority || 'medium',
              status: 'todo',
              // Convert any time-tracked minutes to hours if they exist
              time_tracked: task.estimated_minutes 
                ? Math.round(task.estimated_minutes / 60 * 100) / 100 
                : null
            }));

            const { error: insertError } = await supabase
              .from('tasks')
              .insert(projectTasks);

            if (insertError) throw insertError;
          }
        }
      }

      toast({
        title: "Success",
        description: mode === 'edit' 
          ? "Project updated successfully" 
          : "Project created successfully",
      });
      
      if (mode === 'create') {
        form.reset();
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Project operation error:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode} project. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'create' && (
          <FormField
            control={form.control}
            name="template_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Template (Optional)</FormLabel>
                <FormControl>
                  <TemplateCombobox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleTemplateSelect(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="2024 Tax Return" {...field} />
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
                  placeholder="Project details..."
                  className="h-24"
                  {...field}
                  value={field.value || ''}
                />
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
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="estimated_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Hours</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="preparation">Preparation</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="filing">Filing</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? (mode === 'edit' ? "Updating..." : "Creating...") : (mode === 'edit' ? "Update Project" : "Create Project")}
          </Button>
        </div>
      </form>
    </Form>
  );
}