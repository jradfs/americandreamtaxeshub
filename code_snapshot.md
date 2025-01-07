# Code Analysis Snapshot

## Large Files Analysis

### `src\components\clients\client-form.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DbClient, ClientWithRelations, CLIENT_STATUS, ContactInfo, TaxInfo } from '@/types/clients'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ClientFormProps {
  client?: DbClient | null
  onSubmit: (data: ClientFormSchema) => Promise<void>
}

export function ClientForm({ client, onSubmit }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client?.id || '',
      full_name: client?.full_name || '',
      email: client?.email || '',
      contact_email: client?.contact_email || '',
      status: client?.status || 'pending',
      type: client?.type || 'individual',
      contact_info: client?.contact_info ? JSON.parse(JSON.stringify(client.contact_info)) : null,
      tax_info: client?.tax_info ? JSON.parse(JSON.stringify(client.tax_info)) : null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              className={errors.full_name ? 'border-destructive' : ''}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              {...register('contact_email')}
              className={errors.contact_email ? 'border-destructive' : ''}
            />
            {errors.contact_email && (
              <p className="text-sm text-destructive">
                {errors.contact_email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value as any)}
              defaultValue={client?.status || 'pending'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => setValue('type', value as any)}
              defaultValue={client?.type || 'individual'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  )
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
      service_type: project.service_type,
      status: project.status,
      priority: project.priority,
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
      task_count: project.task_count,
      created_at: project.created_at,
      updated_at: project.updated_at
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
      checklist: null,
      activity_log: null,
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
      client_documents: {
        Row: {
          client_id: string | null
          document_name: string
          document_type: string
          id: number
          reminder_sent: boolean | null
          status: string
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          document_name: string
          document_type: string
          id?: never
          reminder_sent?: boolean | null
          status: string
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          document_name?: string
          document_type?: string
          id?: never
          reminder_sent?: boolean | null
          status?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: number
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: never
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: never
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
          contact_info: Json
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
          contact_info?: Json
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
          contact_info?: Json
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
          id: number
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: never
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: never
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
          id: number
          project_id: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: number
          message: string
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: never
          message: string
          sent_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          id?: never
          message?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          id: number
          individual_id: number | null
          ownership_percentage: number | null
        }
        Insert: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
        }
        Update: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
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
          id: number
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
          id?: never
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
          id?: never
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
          tax_return_id: number | null
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
          tax_return_id?: number | null
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
          tax_return_id?: number | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_tax_return"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_return_deadlines"
            referencedColumns: ["id"]
          },
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
          activity_log: Json | null
          assigned_team: string[] | null
          assignee_id: string | null
          category: string | null
          checklist: Json | null
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
          activity_log?: Json | null
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
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
          activity_log?: Json | null
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
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
          id: number
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
          id?: never
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
          id?: never
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
          id: number
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
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
      tax_return_deadlines: {
        Row: {
          assigned_to_email: string | null
          client_name: string | null
          company_name: string | null
          deadline_status: string | null
          due_date: string | null
          extension_date: string | null
          filing_type: string | null
          id: number | null
          status: string | null
          tax_year: number | null
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

import { useState, useEffect, useCallback } from 'react'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { 
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  taskStatusOptions, 
  taskPriorityOptions,
  ChecklistItem
} from '@/types/tasks'
import { Database } from '@/types/database.types'
import type { ActivityLogEntry, RecurringConfig } from '@/types/tasks'
import { User } from '@/types/users'

// Helper function to safely parse checklist
const parseChecklist = (data: any): ChecklistItem[] | null => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: String(item.id),
      title: String(item.title),
      completed: Boolean(item.completed)
    }));
  }
  return null;
}

// Helper function to safely parse activity_log
const parseActivityLog = (data: any): ActivityLogEntry[] | null => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      timestamp: String(item.timestamp),
      user_id: String(item.user_id),
      action: String(item.action),
      details: item.details || {}
    }));
  }
  return null;
}

// Helper function to safely parse recurring_config
const parseRecurringConfig = (data: any): RecurringConfig | null => {
  if (data && typeof data === 'object') {
    return {
      frequency: data.frequency,
      interval: Number(data.interval),
      end_date: data.end_date ? String(data.end_date) : undefined,
      end_occurrences: data.end_occurrences ? Number(data.end_occurrences) : undefined
    };
  }
  return null;
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'not_started'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  progress: z.number().min(0).max(100).optional(),
  due_date: z.date().optional()
})

interface TaskSidePanelProps {
  isOpen: boolean
  onClose: () => void
  task: TaskWithRelations | null
  projectId?: string
  clientId?: string
  onTaskUpdate?: (task: TaskWithRelations) => void
}

export function TaskSidePanel({ 
  isOpen, 
  onClose, 
  task, 
  projectId,
  clientId,
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
      priority: task?.priority || 'medium',
      progress: task?.progress || 0,
      due_date: task?.due_date ? new Date(task.due_date) : undefined
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
        project_id: projectId,
        client_id: clientId,
        updated_at: new Date().toISOString()
      }

      if (task) {
        const { data: updatedTask, error } = await supabase
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

        if (error) throw error

        toast({
          title: 'Task updated',
          description: 'The task has been successfully updated.'
        })

        if (onTaskUpdate && updatedTask) {
          const transformedTask: TaskWithRelations = {
            ...updatedTask,
            checklist: parseChecklist(updatedTask.checklist) as ChecklistItem[] | null,
            activity_log: parseActivityLog(updatedTask.activity_log) as ActivityLogEntry[] | null,
            recurring_config: parseRecurringConfig(updatedTask.recurring_config) as RecurringConfig | null,
            status: updatedTask.status as TaskStatus,
            priority: updatedTask.priority as TaskPriority,
            assignee: updatedTask.assignee as User | null,
            project: updatedTask.project,
            parent_task: updatedTask.parent_task
          }
          onTaskUpdate(transformedTask)
        }
      } else {
        const { data: newTask, error } = await supabase
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

        if (error) throw error

        toast({
          title: 'Task created',
          description: 'The task has been successfully created.'
        })

        if (onTaskUpdate && newTask) {
          const transformedTask: TaskWithRelations = {
            ...newTask,
            checklist: parseChecklist(newTask.checklist) as ChecklistItem[] | null,
            activity_log: parseActivityLog(newTask.activity_log) as ActivityLogEntry[] | null,
            recurring_config: parseRecurringConfig(newTask.recurring_config) as RecurringConfig | null,
            status: newTask.status as TaskStatus,
            priority: newTask.priority as TaskPriority,
            assignee: newTask.assignee as User | null,
            project: newTask.project,
            parent_task: newTask.parent_task
          }
          onTaskUpdate(transformedTask)
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

        <Form form={form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
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
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskPriorityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
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
      client_documents: {
        Row: {
          client_id: string | null
          document_name: string
          document_type: string
          id: number
          reminder_sent: boolean | null
          status: string
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          document_name: string
          document_type: string
          id?: never
          reminder_sent?: boolean | null
          status: string
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          document_name?: string
          document_type?: string
          id?: never
          reminder_sent?: boolean | null
          status?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: number
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: never
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: never
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
          contact_info: Json
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
          contact_info?: Json
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
          contact_info?: Json
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
          id: number
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: never
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: never
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
          id: number
          project_id: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: never
          project_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: number
          message: string
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: never
          message: string
          sent_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          id?: never
          message?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          client_id: string | null
          id: number
          individual_id: number | null
          ownership_percentage: number | null
        }
        Insert: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
        }
        Update: {
          client_id?: string | null
          id?: never
          individual_id?: number | null
          ownership_percentage?: number | null
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
          id: number
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
          id?: never
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
          id?: never
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
          tax_return_id: number | null
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
          tax_return_id?: number | null
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
          tax_return_id?: number | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_tax_return"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_return_deadlines"
            referencedColumns: ["id"]
          },
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
          activity_log: Json | null
          assigned_team: string[] | null
          assignee_id: string | null
          category: string | null
          checklist: Json | null
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
          activity_log?: Json | null
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
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
          activity_log?: Json | null
          assigned_team?: string[] | null
          assignee_id?: string | null
          category?: string | null
          checklist?: Json | null
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
          id: number
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
          id?: never
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
          id?: never
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
          id: number
          name: string
          steps: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          steps: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
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
      tax_return_deadlines: {
        Row: {
          assigned_to_email: string | null
          client_name: string | null
          company_name: string | null
          deadline_status: string | null
          due_date: string | null
          extension_date: string | null
          filing_type: string | null
          id: number | null
          status: string | null
          tax_year: number | null
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


## File Size Analysis

| File | Size (KB) |
|------|------------|
| src/types/database.types.ts | 47.3 |
| src\types\database.types.ts | 47.3 |
| src\components\ui\sidebar.tsx | 22.8 |
| src\components\templates\template-form.tsx | 11.9 |
| src\components\tasks\task-side-panel.tsx | 10.3 |
| src\components\templates\create-template-dialog.tsx | 10.1 |
| src/components/clients/client-form.tsx | 4.8 |
| src/components/tasks/task-form.tsx | 3.3 |
| src/components/projects/project-form.tsx | 2.3 |
