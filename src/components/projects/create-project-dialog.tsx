'use client';

import { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClientCombobox } from '@/components/clients/client-combobox';
import { TemplateCombobox } from '@/components/templates/template-combobox';
import { useProjectTemplates } from '@/hooks/useProjectTemplates';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    client_id: '',
    start_date: '',
    due_date: '',
    stage: '',
    template_id: ''
  });

  const { templates } = useProjectTemplates();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.title,
        description: template.description || '',
        priority: template.default_priority || 'medium',
        template_id: template.id
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert([{
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          client_id: formData.client_id || null,
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
          stage: formData.stage || null,
          template_id: formData.template_id || null
        }])
        .select('id, name, description, status, priority, client_id, start_date, due_date, stage, template_id')
        .single();

      if (error) throw error;

      // If template is selected, create template tasks
      if (formData.template_id) {
        const { data: templateTasks, error: tasksError } = await supabase
          .from('template_tasks')
          .select('*')
          .eq('template_id', formData.template_id)
          .order('order_index');

        if (tasksError) throw tasksError;

        if (templateTasks?.length) {
          const projectTasks = templateTasks.map(task => ({
            project_id: project.id,
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

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
          onClick={() => onOpenChange(false)}
        />
        <div className="fixed flex min-h-[200px] w-[90vw] max-w-[600px] flex-col rounded-lg border bg-background p-0">
          <div className="relative px-6 py-4 border-b">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-lg font-semibold leading-none tracking-tight">Create New Project</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new project to track tax preparation, bookkeeping, or other client work.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Project Template (Optional)</Label>
              <TemplateCombobox
                value={formData.template_id}
                onChange={handleTemplateSelect}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                placeholder="2024 Tax Return"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Project details..."
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="To Do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={value => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={e => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client</Label>
              <ClientCombobox
                value={formData.client_id}
                onChange={value => setFormData(prev => ({ ...prev, client_id: value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={value => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="preparation">Preparation</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="filing">Filing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
