'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const projectSchema = z.object({
    name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    due_date: z.date().optional(),
    start_date: z.date().optional(),
    stage: z.string().optional(),
    client_id: z.string().min(1, "Client is required"),
    template_id: z.string().min(1, "Template is required")
});

export function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
    const supabase = createClientComponentClient();
    const [clients, setClients] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            status: 'todo',
            priority: 'medium',
            client_id: '',
            template_id: ''
        }
    });

    const selectedTemplate = form.watch('template_id');
    const selectedClient = form.watch('client_id');

    useEffect(() => {
        const fetchData = async () => {
            const { data: clients } = await supabase
                .from('clients')
                .select('id, full_name, company_name');
            setClients(clients || []);

            const { data: templates } = await supabase
                .from('project_templates')
                .select('id, title, project_defaults');
            setTemplates(templates || []);
        };

        fetchData();
    }, [supabase]);

    useEffect(() => {
        if (selectedTemplate && selectedClient) {
            const template = templates.find(t => t.id === selectedTemplate);
            const client = clients.find(c => c.id === selectedClient);
            
            // Ensure we have valid template and client
            if (!template || !client) return;

            // Create default project defaults if missing
            const defaults = template.project_defaults || {
                name_format: '[Client] - [Template] - [Date]',
                description: '',
                status: 'todo',
                priority: 'medium',
                duration_days: 30
            };
            
            // Generate project name with fallbacks
            const name = (defaults.name_format || '[Client] - [Template] - [Date]')
                .replace('[Client]', client?.company_name || client?.full_name || 'New Client')
                .replace('[Template]', template?.title || 'New Template')
                .replace('[Date]', format(new Date(), 'yyyy-MM-dd'));
            
            form.setValue('name', name);
            
            // Set other defaults
            if (defaults.description) {
                form.setValue('description', defaults.description);
            }
            if (defaults.status) {
                form.setValue('status', defaults.status);
            }
            if (defaults.priority) {
                form.setValue('priority', defaults.priority);
            }
            
            // Set dates based on duration
            if (defaults.duration_days) {
                const startDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(startDate.getDate() + defaults.duration_days);
                
                form.setValue('start_date', startDate);
                form.setValue('due_date', dueDate);
            }
        }
    }, [selectedTemplate, selectedClient, templates, clients, form]);

    const onSubmit = async (values: z.infer<typeof projectSchema>) => {
        setIsLoading(true);
        try {
            // Create project
            const { data: project, error } = await supabase
                .from('projects')
                .insert({
                    name: values.name,
                    description: values.description,
                    status: values.status,
                    priority: values.priority,
                    due_date: values.due_date ? values.due_date.toISOString() : null,
                    start_date: values.start_date ? values.start_date.toISOString() : null,
                    stage: values.stage,
                    client_id: values.client_id,
                    template_id: values.template_id
                })
                .select('id')
                .single();

            if (error) throw error;

            // Create tasks from template
            await supabase.rpc('create_project_tasks', {
                p_project_id: project.id,
                p_template_id: values.template_id
            });

            toast.success('Project created successfully');
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Project creation error:', error);
            toast.error('Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="template_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Template</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {templates.map(template => (
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

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project priority" />
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

                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
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
                                                <span>Pick a start date</span>
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
                                            date > new Date() || date < new Date('1900-01-01')
                                        }
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
                                                <span>Pick a due date</span>
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
                                            date < new Date() || date > new Date('2100-01-01')
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
            </form>
        </Form>
    );
}
