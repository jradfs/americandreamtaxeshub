# Code Analysis Snapshot

## Overview
This snapshot includes core functionality for data fetching, dashboard, and metrics.

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
      activity_log_entries: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          id: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_details: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          id: string
          reminder_sent: boolean | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          id?: string
          reminder_sent?: boolean | null
          status: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          id?: string
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
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
          onboarding_notes: string | null
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

... (file truncated, showing 500 of 1905 lines) ...

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

### `src\hooks\useTaskManagement.ts`

```typescript
'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { TaskSchema } from '@/types/tasks'

export function useTaskManagement() {
  const form = useForm<{ tasks: TaskSchema[] }>()

  const validateTaskDependencies = useCallback((tasks: TaskSchema[]) => {
    const errors: Record<string, { message: string; type: string }> = {}
    
    tasks.forEach(task => {
      // Validate dates
      if (task.start_date && isNaN(new Date(task.start_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid start date format',
          type: 'date'
        }
      }
      
      if (task.due_date && isNaN(new Date(task.due_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid due date format',
          type: 'date'
        }
      }

      // Validate date order
      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date)
        const due = new Date(task.due_date)
        if (start > due) {
          errors[task.id] = {
            message: 'Start date must be before due date',
            type: 'date'
          }
        }
      }
    })

    return errors
  }, [])

  const addTask = useCallback((task: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const newId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
    
    const newTask: TaskSchema = {
      id: task.id || newId,
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dependencies: task.dependencies || [],
      start_date: task.start_date,
      due_date: task.due_date
    }

    const errors = validateTaskDependencies([...currentTasks, newTask])
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', [...currentTasks, newTask])
    return { success: true }
  }, [form, validateTaskDependencies])

  const removeTask = useCallback((taskId: string) => {
    const currentTasks = form.getValues('tasks') || []
    form.setValue('tasks', currentTasks.filter(t => t.id !== taskId))
  }, [form])

  const updateTask = useCallback((taskId: string, updates: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const taskIndex = currentTasks.findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) return { success: false, error: 'Task not found' }

    const updatedTask = { ...currentTasks[taskIndex], ...updates }
    const updatedTasks = [...currentTasks]
    updatedTasks[taskIndex] = updatedTask

    const errors = validateTaskDependencies(updatedTasks)
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', updatedTasks)
    return { success: true }
  }, [form, validateTaskDependencies])

  return {
    form,
    addTask,
    removeTask,
    updateTask
  }
}

```

### `src\app\api\tasks\route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database.types';
import { taskSchema } from '@/types/validation';
import type { z } from 'zod';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type ValidatedTask = z.infer<typeof taskSchema>;
type ChecklistItemInsert = Database['public']['Tables']['checklist_items']['Insert'];
type ActivityLogInsert = Database['public']['Tables']['activity_log_entries']['Insert'];

interface TaskInput extends ValidatedTask {
  checklistItems?: Array<{
    title: string;
    description?: string | null;
    completed?: boolean;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const assigneeId = searchParams.get('assigneeId');

    const supabase = createRouteHandlerClient<Database>({ cookies });

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles(id, full_name, email),
        project:projects(id, name),
        parent_task:tasks(id, title),
        checklist_items(*),
        activity_log_entries(*)
      `);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (assigneeId) {
      query = query.eq('assignee_id', assigneeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData: TaskInput = await request.json();
    const { checklistItems, ...taskData } = formData;
    const validatedData = taskSchema.parse(taskData);

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Insert task first
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert([{
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        due_date: validatedData.due_date,
        assignee_id: validatedData.assignee_id,
        project_id: validatedData.project_id,
      } satisfies TaskInsert])
      .select()
      .single();

    if (taskError) throw taskError;

    // Handle checklist items if provided
    if (checklistItems?.length) {
      const { error: checklistError } = await supabase
        .from('checklist_items')
        .insert(
          checklistItems.map(item => ({
            task_id: task.id,
            title: item.title,
            description: item.description,
            completed: item.completed || false
          }))
        );

      if (checklistError) throw checklistError;
    }

    // Add activity log entry
    const { error: activityError } = await supabase
      .from('activity_log_entries')
      .insert({
        task_id: task.id,
        action: 'created',
        details: { status: task.status }
      });

    if (activityError) throw activityError;

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, checklistItems, ...updates }: TaskInput & { id: string } = await request.json();
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Valid task ID (UUID) is required' },
        { status: 400 }
      );
    }

    const validatedData = taskSchema.partial().parse(updates);
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Update task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        due_date: validatedData.due_date,
        assignee_id: validatedData.assignee_id,
        project_id: validatedData.project_id,
      })
      .eq('id', id)
      .select()
      .single();

    if (taskError) throw taskError;

    // Handle checklist items if provided
    if (checklistItems !== undefined) {
      // Delete existing items
      await supabase
        .from('checklist_items')
        .delete()
        .eq('task_id', id);

      // Insert new items
      if (checklistItems.length > 0) {
        const { error: checklistError } = await supabase
          .from('checklist_items')
          .insert(
            checklistItems.map(item => ({
              task_id: id,
              title: item.title,
              description: item.description,
              completed: item.completed || false
            } satisfies ChecklistItemInsert))
          );

        if (checklistError) throw checklistError;
      }
    }

    // Add activity log entry for update
    const { error: activityError } = await supabase
      .from('activity_log_entries')
      .insert({
        task_id: id,
        action: 'updated',
        details: { updates: validatedData }
      } satisfies ActivityLogInsert);

    if (activityError) throw activityError;

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Valid task ID (UUID) is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Delete related records first (due to foreign key constraints)
    await Promise.all([
      supabase.from('checklist_items').delete().eq('task_id', id),
      supabase.from('activity_log_entries').delete().eq('task_id', id)
    ]);

    // Then delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'

```

### `src\components\projects\project-tasks.tsx`

```typescript
'use client'

import { ProjectWithRelations } from "@/types/projects"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskList } from "@/components/tasks/task-list"
import { useTasks } from "@/hooks/useTasks"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Database } from "@/types/database.types"
import { TaskWithRelations } from "@/types/tasks"

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']

interface ProjectTasksProps {
  project: ProjectWithRelations
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { tasks, isLoading, error, mutate } = useTasks(project.id)

  const handleCreateTask = async (data: DbTaskInsert) => {
    // Handle task creation
    console.log('Create task:', data)
    setDialogOpen(false)
  }

  const handleUpdateTask = async (task: DbTaskInsert, taskId: string) => {
    // Handle task update
    console.log('Update task:', task)
    await mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {error ? (
        <div className="text-red-500">Error loading tasks: {error.message}</div>
      ) : (
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onUpdate={handleUpdateTask}
        />
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        initialData={{
          project_id: project.id,
          status: 'todo',
          priority: 'medium'
        }}
      />
    </div>
  )
}
```

### `docs\PHASE1.MD`

```
# Phase 1: Task Management System Implementation Status

## Current Implementation Status

### 1. Core Features (✅ Implemented)
- Basic task CRUD operations
- Task status management
- Form validation with Zod
- Basic UI components
- Type system foundation

### 2. Type System (🚧 In Progress)
```typescript
// Current Implementation
export interface TaskWithRelations extends DbTask {
  project?: {
    id: string
    name: string
    status: Database['public']['Enums']['project_status']
  } | null
  assignee?: {
    id: string
    full_name: string
  } | null
}

// Improvements Needed:
- Enhanced relationship type handling
- Stricter null safety
- More comprehensive type guards
```

### 3. Component Architecture (🚧 In Progress)
```typescript
// Current Pattern
export function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  // ... implementation
}

// Needed Improvements:
- Error boundaries
- Loading states
- Optimistic updates
- Component composition
```

### 4. State Management (⚠️ Needs Attention)
- Current implementation uses basic React hooks
- Lacks optimistic updates
- Needs better error handling
- Could benefit from caching

## Action Items

### Immediate Priority
1. **Error Handling**
   - Implement error boundaries
   - Add retry mechanisms
   - Improve error messages

2. **Performance Optimization**
   - Add optimistic updates
   - Implement proper loading states
   - Review re-render patterns

3. **Type Safety**
   - Complete type guard coverage
   - Enhance null safety
   - Add relationship type validation

### Short-term Goals
1. **Component Architecture**
   - Refactor for better composition
   - Reduce prop drilling
   - Improve reusability

2. **State Management**
   - Implement caching
   - Add optimistic updates
   - Improve error recovery

3. **Testing**
   - Add unit tests
   - Implement integration tests
   - Add end-to-end tests

## Implementation Guidelines

### 1. Error Handling Pattern
```typescript
export class TaskErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <TaskErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### 2. Optimistic Updates Pattern
```typescript
const createTask = async (data: TaskFormData) => {
  const optimisticId = crypto.randomUUID()
  const optimisticTask = { id: optimisticId, ...data }
  
  setTasks(prev => [optimisticTask, ...prev])
  
  try {
    const result = await api.createTask(data)
    setTasks(prev => prev.map(t => 
      t.id === optimisticId ? result : t
    ))
    return result
  } catch (error) {
    setTasks(prev => prev.filter(t => t.id !== optimisticId))
    throw error
  }
}
```

### 3. Component Composition Pattern
```typescript
export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  return (
    <TaskErrorBoundary>
      <TaskListContent 
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
      />
    </TaskErrorBoundary>
  )
}
```

## Testing Strategy

### 1. Unit Tests
```typescript
describe('TaskForm', () => {
  it('validates required fields', async () => {
    const { result } = renderHook(() => useTaskForm())
    await act(async () => {
      await result.current.handleSubmit({})
    })
    expect(result.current.errors).toHaveProperty('title')
  })
})
```

### 2. Integration Tests
```typescript
describe('TasksPage', () => {
  it('creates and updates tasks', async () => {
    const { getByText, findByText } = render(<TasksPage />)
    // Test implementation
  })
})
```

## Next Steps

1. **Implementation Priority**
   - Complete error handling implementation
   - Add optimistic updates
   - Enhance type safety

2. **Review Process**
   - Code review guidelines
   - Performance review
   - Type safety audit

3. **Documentation**
   - Update component documentation
   - Add testing guidelines
   - Document state management patterns

## Architecture Team Notes

The AI architecture team should focus on:
1. Reviewing type system implementation
2. Evaluating state management patterns
3. Assessing component architecture
4. Reviewing error handling strategies
5. Evaluating testing approach

Please refer to the AI_ARCHITECTURE_PROMPT.md file for detailed review guidelines and expectations.
```

### `src\app\error.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-white">
              {error.message}
            </pre>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

```

### `src\components\projects\project-details.tsx`

```typescript
'use client'

import type { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Phone, Building, FileText } from "lucide-react"
import Link from "next/link"

type DbProject = Database['public']['Views']['project_dashboard']['Row']

interface ProjectDetailsProps {
  project: DbProject
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  if (!project) return <div>No project data available</div>

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Details about the client associated with this project</CardDescription>
        </CardHeader>
        <CardContent>
          {project.client_name ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{project.client_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.client_name}</div>
                  {project.company_name && (
                    <div className="text-sm text-muted-foreground">{project.company_name}</div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${project.id}`}>
                    View Client Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No client associated with this project
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Important dates and project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Due: {project.due_date ? format(new Date(project.due_date), 'MMMM d, yyyy') : 'No due date'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>Service Type: {project.service_type?.replace("_", " ") || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Overview of task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(project.completion_percentage || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {project.total_tasks || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Task Status</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{project.completed_tasks || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {project.assigned_team_members ? (
              <span className="text-sm">{project.assigned_team_members}</span>
            ) : (
              <span className="text-sm text-muted-foreground">No team members assigned</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### `src\types\tasks.ts`

```typescript
import { z } from 'zod'
import type { Database } from './database.types'

export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).nullable(),
  project_id: z.string().nullable(),
  assignee_id: z.string().nullable(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  tax_form_type: z.string().nullable(),
  category: z.string().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>

export type TaskWithRelations = Database['public']['Tables']['tasks']['Row'] & {
  project: Database['public']['Tables']['projects']['Row'] | null
  assignee: Database['public']['Tables']['users']['Row'] | null
}

```

### `src\lib\services\task.service.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { TaskPriority, TaskStatus } from '@/types/tasks'

const supabase = createClientComponentClient<Database>()

// Onboarding task templates for different service types
const onboardingTaskTemplates = {
  'individual': [
    {
      title: 'Initial Client Meeting',
      description: 'Schedule and conduct initial meeting to understand client needs and gather basic information',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Document Collection',
      description: 'Request and collect all necessary tax documents from client',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date
      }
    },
    {
      title: 'Tax Return Preparation',
      description: 'Prepare individual tax return based on collected documents',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date
      }
    }
  ],
  'business': [
    {
      title: 'Business Onboarding Meeting',
      description: 'Set up initial meeting to understand business structure and requirements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        return date
      }
    },
    {
      title: 'Financial Document Collection',
      description: 'Collect business financial documents and statements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Business Tax Planning',
      description: 'Develop initial tax planning strategy based on business type and needs',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 5)
        return date
      }
    }
  ]
}

export async function generateOnboardingTasks(clientId: string, clientType: Database['public']['Enums']['client_type']) {
  try {
    const templates = onboardingTaskTemplates[clientType]
    if (!templates) {
      throw new Error(`No task templates found for client type: ${clientType}`)
    }

    const tasksToCreate = templates.map(template => ({
      title: template.title,
      description: template.description,
      status: 'todo' as TaskStatus,
      priority: template.priority,
      due_date: template.estimateDueDate()?.toISOString(),
      client_id: clientId,
      category: 'onboarding',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksToCreate)
      .select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error generating onboarding tasks:', error)
    throw error
  }
}

export async function createTask(taskData: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function updateTask(taskId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export async function getTasksByClient(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
} 
```

### `src\components\tasks\task-card.tsx`

```typescript
'use client';

import { TaskWithRelations } from '@/types/tasks'

interface TaskCardProps {
  task: TaskWithRelations
  onEdit: (task: TaskWithRelations) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium">{task.title}</h3>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{task.status}</span>
          {task.priority && <span className="text-sm text-gray-500">{task.priority}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

```

### `src\lib\validations\schema.ts`

```typescript
import { z } from 'zod'
import { 
  CLIENT_STATUS, 
  CLIENT_TYPE, 
  FILING_TYPE 
} from '@/types/clients'
import {
  PROJECT_STATUS,
  SERVICE_TYPE
} from '@/types/projects'
import {
  TASK_STATUS,
  TASK_PRIORITY
} from '@/types/tasks'

// Client Schemas
export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  alternate_email: z.string().email().optional(),
  alternate_phone: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone']).optional(),
  notes: z.string().optional()
})

export const taxInfoSchema = z.object({
  filing_type: z.enum(FILING_TYPE),
  tax_id_type: z.enum(['ssn', 'ein']).optional(),
  tax_id: z.string().optional(),
  filing_status: z.string().optional(),
  dependents: z.array(z.object({
    name: z.string(),
    ssn: z.string().optional(),
    relationship: z.string().optional(),
    birth_date: z.string().optional()
  })).optional(),
  previous_returns: z.array(z.object({
    year: z.number(),
    filed_date: z.string(),
    preparer: z.string().optional(),
    notes: z.string().optional()
  })).optional()
})

export const clientSchema = z.object({
  contact_email: z.string().email(),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  status: z.enum(CLIENT_STATUS),
  type: z.enum(CLIENT_TYPE),
  contact_info: contactInfoSchema,
  tax_info: taxInfoSchema.nullable(),
  business_tax_id: z.string().optional(),
  individual_tax_id: z.string().optional()
})

// Project Schemas
export const projectTaxInfoSchema = z.object({
  return_type: z.enum(FILING_TYPE),
  tax_year: z.number(),
  filing_status: z.string().optional(),
  is_extension_filed: z.boolean().optional(),
  extension_date: z.string().optional(),
  documents_received: z.boolean().optional(),
  last_filed_date: z.string().optional()
})

export const accountingInfoSchema = z.object({
  fiscal_year_end: z.string().optional(),
  accounting_method: z.enum(['cash', 'accrual']).optional(),
  last_reconciliation_date: z.string().optional(),
  software: z.string().optional(),
  chart_of_accounts_setup: z.boolean().optional(),
  notes: z.string().optional()
})

export const payrollInfoSchema = z.object({
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly']).optional(),
  employee_count: z.number().optional(),
  last_payroll_date: z.string().optional(),
  next_payroll_date: z.string().optional(),
  tax_deposit_schedule: z.enum(['monthly', 'semi-weekly']).optional(),
  notes: z.string().optional()
})

export const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUS),
  service_type: z.enum(SERVICE_TYPE),
  client_id: z.string().optional(),
  primary_manager: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  end_date: z.string().optional(),
  tax_info: projectTaxInfoSchema.nullable(),
  accounting_info: accountingInfoSchema.nullable(),
  payroll_info: payrollInfoSchema.nullable(),
  service_info: z.record(z.unknown()).nullable()
})

// Task Schemas
export const taskRecurringConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number(),
  end_date: z.string().optional(),
  end_occurrences: z.number().optional()
})

export const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(TASK_STATUS),
  priority: z.enum(TASK_PRIORITY).optional(),
  project_id: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  start_date: z.string().optional(),
  progress: z.number().optional(),
  recurring_config: taskRecurringConfigSchema.nullable(),
  parent_task_id: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional()
}) 
```

### `src\components\ui\form.tsx`

```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"form">
>(({ className, onSubmit, children, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn("space-y-8", className)}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  )
})
Form.displayName = "Form"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { id } = itemContext

  const fieldState = {
    invalid: formState?.errors?.[fieldContext.name] ? true : false,
    isDirty: formState?.dirtyFields?.[fieldContext.name] ? true : false,
    isTouched: formState?.touchedFields?.[fieldContext.name] ? true : false,
    error: formState?.errors?.[fieldContext.name]
  }

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormFieldContext,
  FormItemContext,
  FormProvider,
}

```

### `src\components\tasks\task-side-panel.tsx`

```typescript
'use client'

import { useState } from 'react'
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
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import type { Json } from '@/types/database.types'
import { 
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  taskStatusOptions, 
  taskPriorityOptions
} from '@/types/tasks'
import { Database } from '@/types/database.types'
import { taskSchema } from '@/lib/validations/task'
import type { TaskFormSchema } from '@/lib/validations/task'

type ActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Insert']

type TaskWithRelationsResponse = Database['public']['Tables']['tasks']['Row'] & {
  assignee: {
    id: string
    email: string
    full_name: string
    role: Database['public']['Enums']['user_role']
  } | null
  project: {
    id: string
    name: string
  } | null
  parent_task: {
    id: string
    title: string
  } | null
  activity_log_entries: Database['public']['Tables']['activity_log_entries']['Row'][]
}

type DbTask = Database['public']['Tables']['tasks']['Row']
type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

type FormData = TaskFormSchema

interface TaskSidePanelProps {
  isOpen: boolean
  onClose: () => void
  task: TaskWithRelations | null
  projectId?: string
  onTaskUpdate?: (task: TaskWithRelations) => void
}

export function TaskSidePanel({ 
  isOpen, 
  onClose, 
  task, 
  projectId,
  onTaskUpdate
}: TaskSidePanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  
  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      project_id: task.project_id,
      assignee_id: task.assignee_id || undefined,
      status: task.status as TaskStatus || 'todo',
      priority: task.priority as TaskPriority || 'medium',
      due_date: task.due_date || null,
      start_date: task.start_date || null,
      checklist: {
        items: task.checklist_items?.map(item => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
          description: item.description || null,
          task_id: item.task_id
        })) || null,
        completed_count: task.checklist_items?.filter(item => item.completed).length || 0,
        total_count: task.checklist_items?.length || 0
      },
      activity_log: task.activity_log_entries?.map(entry => ({
        action: entry.action,
        timestamp: entry.created_at || '',
        user_id: entry.performed_by,
        details: entry.details?.toString() || ''
      })) || null,
      recurring_config: task.recurring_config
    } : {
      title: '',
      description: '',
      project_id: '', // This should be provided by the parent component
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      due_date: null,
      start_date: null,
      checklist: null,
      activity_log: null,
      recurring_config: null
    }
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
        start_date: data.start_date,
        recurring_config: data.recurring_config,
        updated_at: new Date().toISOString()
      } satisfies DbTaskUpdate

      if (task?.id) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id)
        
        if (error) throw error

        // Update checklist items
        if (data.checklist?.items) {
          const checklistItems = data.checklist.items.map(item => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: task.id,
            updated_at: new Date().toISOString()
          })) satisfies Database['public']['Tables']['checklist_items']['Insert'][]

          const { error: checklistError } = await supabase
            .from('checklist_items')
            .upsert(checklistItems)
          
          if (checklistError) throw checklistError
        }

        // Add activity log entry
        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert({
            task_id: task.id,
            action: 'updated',
            details: taskData,
            created_at: new Date().toISOString()
          })
        
        if (activityError) throw activityError
      } else {
        const insertData = {
          ...taskData,
          title: data.title, // Explicitly include required fields
          created_at: new Date().toISOString()
        } satisfies DbTaskInsert

        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([insertData])
          .select()
          .single()
        
        if (error) throw error

        // Create checklist items
        if (data.checklist?.items && newTask) {
          const checklistItems = data.checklist.items.map(item => ({
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: newTask.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) satisfies Database['public']['Tables']['checklist_items']['Insert'][]

          const { error: checklistError } = await supabase
            .from('checklist_items')
            .insert(checklistItems)
          
          if (checklistError) throw checklistError
        }

        // Add initial activity log entry
        if (newTask) {
          const { error: activityError } = await supabase
            .from('activity_log_entries')
            .insert({
              task_id: newTask.id,
              action: 'created',
              details: { status: newTask.status },
              created_at: new Date().toISOString()
            })
          
          if (activityError) throw activityError
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
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

        <div className="space-y-4 mt-4">
          <Form form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormLabel id="status-label">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger aria-labelledby="status-label">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                    <FormLabel id="priority-label">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger aria-labelledby="priority-label">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskPriorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : task ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### `src\lib\validations\task.ts`

```typescript
import { z } from 'zod'
import { TaskStatus, TaskPriority, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().nullable().optional(),
  status: z.enum(taskStatusOptions),
  priority: z.enum(taskPriorityOptions).nullable().optional(),
  project_id: z.string().uuid('Invalid project ID').nullable().optional(),
  assignee_id: z.string().uuid('Invalid assignee ID').nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  tax_form_type: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ['in_progress', 'review'],
  in_progress: ['todo', 'review', 'completed'],
  review: ['in_progress', 'completed'],
  completed: ['review']
} as const

// Utility type for valid status transitions
export type ValidStatusTransition<T extends TaskStatus> = typeof taskStatusTransitions[T][number]
```

### `src\components\tasks\task-list.tsx`

```typescript
'use client'

import { useState } from 'react'
import { TaskDialog } from './task-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskFormData, TaskWithRelations, toTaskFormData } from '@/types/tasks'

interface TaskListProps {
  tasks: TaskWithRelations[]
  isLoading?: boolean
  onUpdate?: (taskId: string, data: TaskFormData) => Promise<void>
  onDelete?: (taskId: string) => Promise<void>
  onCreate?: (data: TaskFormData) => Promise<void>
}

export function TaskList({
  tasks,
  isLoading = false,
  onUpdate,
  onDelete,
  onCreate
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleOpenDialog = (task?: TaskWithRelations) => {
    setSelectedTask(task || null)
    setIsCreating(!task)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (isCreating && onCreate) {
        await onCreate(data)
      } else if (selectedTask?.id && onUpdate) {
        await onUpdate(selectedTask.id, data)
      }
      setDialogOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Failed to submit task:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Button disabled>Create Task</Button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button onClick={() => handleOpenDialog()}>Create Task</Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    {task.priority && (
                      <Badge variant="outline">{task.priority}</Badge>
                    )}
                    {task.project && (
                      <Badge variant="outline">{task.project.name}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onUpdate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(task)}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedTask ? toTaskFormData(selectedTask) : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
```

### `src\components\tasks\task-dialog.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { taskSchema, type TaskFormData, type TaskWithRelations, type TaskStatus, type TaskPriority } from '@/types/tasks'

interface TaskDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  taskData?: TaskWithRelations | null
  onSubmit: (data: TaskFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TaskDialog({ 
  isOpen, 
  setIsOpen, 
  taskData, 
  onSubmit,
  isSubmitting 
}: TaskDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskData?.title || '',
      description: taskData?.description || '',
      status: (taskData?.status as TaskStatus) || 'todo',
      priority: (taskData?.priority as TaskPriority | null) || null,
      project_id: taskData?.project_id || null,
      assignee_id: taskData?.assignee_id || null,
      due_date: taskData?.due_date || null,
      start_date: taskData?.start_date || null,
      tax_form_type: taskData?.tax_form_type || null,
      category: taskData?.category || null,
    }
  })

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskData ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
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
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : taskData ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### `src\hooks\useProjects.ts`

```typescript
'use client'

import { useCallback, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Tables } from '@/types/database.types'
import type { ProjectFormData } from '@/lib/validations/project'

export function useProjects() {
  const supabase = createClientComponentClient()
  const [sorting, setSorting] = useState({ column: 'created_at', direction: 'desc' })
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select('*, tax_returns(*)', { count: 'exact' })

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value)
      }
    })

    // Apply sorting
    query = query.order(sorting.column, { ascending: sorting.direction === 'asc' })

    // Apply pagination
    const from = (pagination.page - 1) * pagination.pageSize
    query = query.range(from, from + pagination.pageSize - 1)

    return query
  }, [supabase, filters, pagination, sorting])

  const fetchProjects = useCallback(async () => {
    try {
      const query = buildQuery()
      const { data: projects, count, error } = await query

      if (error) throw error

      return { projects: projects || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { projects: [], count: 0 }
    }
  }, [buildQuery])

  const createProject = useCallback(async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert(data)
        .select()
        .single()

      if (error) throw error
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }, [supabase])

  return {
    fetchProjects,
    createProject,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
  }
}

```

### `src\types\projects.ts`

```typescript
import { Database } from './database.types';
import type { Json } from './database.types';
import { z } from 'zod';
import { projectSchema } from '@/lib/validations/project';

// Database types
export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Enums from database
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type ServiceType = Database['public']['Enums']['service_type'];
export type TaskPriority = Database['public']['Enums']['task_priority'];

// Strongly typed JSON fields
export interface TaxInfo {
  return_type?: Database['public']['Enums']['filing_type']
  filing_status?: string
  tax_year?: number
  due_date?: string
  extension_date?: string
  estimated_refund?: number
  estimated_liability?: number
  notes?: string
}

export interface AccountingInfo {
  period_start?: string
  period_end?: string
  accounting_method?: 'cash' | 'accrual'
  fiscal_year_end?: string
  last_reconciliation_date?: string
  chart_of_accounts_setup?: boolean
  software_used?: string
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

export interface PayrollInfo {
  payroll_schedule?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
  employee_count?: number
  last_payroll_date?: string
  next_payroll_date?: string
  payroll_provider?: string
  notes?: string
}

export interface ServiceInfo {
  service_category?: string
  frequency?: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  last_service_date?: string
  next_service_date?: string
  special_instructions?: string
  notes?: string
}

// Form data type that matches our schema
export type ProjectFormData = z.infer<typeof projectSchema>;

// Enhanced project type with relationships and strongly typed JSON fields
export interface ProjectWithRelations extends Omit<DbProject, 'tax_info' | 'accounting_info' | 'payroll_info' | 'service_info'> {
  tax_info: TaxInfo | null
  accounting_info: AccountingInfo | null
  payroll_info: PayrollInfo | null
  service_info: ServiceInfo | null
  client?: Database['public']['Tables']['clients']['Row'] | null
  template?: Database['public']['Tables']['project_templates']['Row'] | null
  tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_members?: Database['public']['Tables']['project_team_members']['Row'][]
  primary_manager_details?: Database['public']['Tables']['users']['Row'] | null
}

// Type guards
export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('tax_year' in value) || typeof value.tax_year === 'number') &&
    (!('estimated_refund' in value) || typeof value.estimated_refund === 'number') &&
    (!('estimated_liability' in value) || typeof value.estimated_liability === 'number')
}

export function isAccountingInfo(value: unknown): value is AccountingInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('chart_of_accounts_setup' in value) || typeof value.chart_of_accounts_setup === 'boolean') &&
    (!('accounting_method' in value) || ['cash', 'accrual'].includes(value.accounting_method as string))
}

export function isPayrollInfo(value: unknown): value is PayrollInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('employee_count' in value) || typeof value.employee_count === 'number') &&
    (!('payroll_schedule' in value) || ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'].includes(value.payroll_schedule as string))
}

export function isServiceInfo(value: unknown): value is ServiceInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('frequency' in value) || ['one-time', 'weekly', 'monthly', 'quarterly', 'annually'].includes(value.frequency as string))
}

export function isDbProject(project: unknown): project is DbProject {
  return project !== null &&
    typeof project === 'object' &&
    'id' in project &&
    'name' in project &&
    'status' in project
}

// Conversion utilities
export function toProjectFormData(project: DbProject): Omit<ProjectFormData, 'service_type' | 'priority'> & {
  service_type?: ServiceType | null
  priority?: TaskPriority | null
} {
  const {
    id,
    created_at,
    updated_at,
    priority,
    service_type,
    ...formData
  } = project
  
  return {
    ...formData,
    priority: priority as TaskPriority,
    service_type: service_type as ServiceType,
    tax_info: isTaxInfo(project.tax_info) ? project.tax_info : null,
    accounting_info: isAccountingInfo(project.accounting_info) ? project.accounting_info : null,
    payroll_info: isPayrollInfo(project.payroll_info) ? project.payroll_info : null,
    service_info: isServiceInfo(project.service_info) ? project.service_info : null,
  }
}

export function toDbProject(formData: ProjectFormData): DbProjectInsert {
  const {
    tax_info,
    accounting_info,
    payroll_info,
    service_info,
    ...rest
  } = formData

  return {
    ...rest,
    name: rest.name || '',
    status: rest.status || 'not_started',
    tax_info: tax_info as Json,
    accounting_info: accounting_info as Json,
    payroll_info: payroll_info as Json,
    service_info: service_info as Json,
  }
}

// Constants
export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ProjectStatus>

export const SERVICE_TYPE = {
  TAX_RETURN: 'tax_return',
  BOOKKEEPING: 'bookkeeping',
  PAYROLL: 'payroll',
  ADVISORY: 'advisory',
} as const satisfies Record<string, ServiceType>

// Helper functions for type checking
export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(status as ProjectStatus)
}

export function isValidServiceType(type: string): type is ServiceType {
  return Object.values(SERVICE_TYPE).includes(type as ServiceType)
}

```

### `src\lib\supabase\dashboardQueries.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

type TaxReturnStatus = Database['public']['Enums']['tax_return_status'];
type ProjectStatus = Database['public']['Enums']['project_status'];
type ClientStatus = Database['public']['Enums']['client_status'];

export async function getDashboardMetrics() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Debug: Check if we can access the tax_returns table at all
    console.log('Checking tax_returns table access...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('tax_returns')
      .select('status')
      .limit(1);

    if (tableError) {
      console.error('Failed to access tax_returns table:', {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
        hint: tableError.hint
      });
    } else {
      console.log('Successfully accessed tax_returns table. Sample data:', tableCheck);
    }

    // Get total active clients
    const { count: totalActiveClients, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active' satisfies ClientStatus);

    if (clientsError) throw new Error(`Failed to fetch active clients: ${clientsError.message}`);

    // Get pending tax returns (not_started or gathering_documents)
    console.log('Attempting to fetch tax returns with status filter...');
    const statuses = ['not_started', 'gathering_documents'] satisfies TaxReturnStatus[];
    console.log('Using status filters:', statuses);
    
    const taxReturnsQuery = supabase
      .from('tax_returns')
      .select('*', { count: 'exact', head: true })
      .in('status', statuses);

    console.log('Executing query:', taxReturnsQuery.toSQL());
    const { count: pendingTaxReturns, error: taxReturnsError } = await taxReturnsQuery;

    if (taxReturnsError) {
      console.error('Tax returns query error details:', {
        message: taxReturnsError.message,
        code: taxReturnsError.code,
        details: taxReturnsError.details,
        hint: taxReturnsError.hint,
        query: taxReturnsQuery.toSQL()
      });
      throw new Error(`Failed to fetch pending tax returns: ${taxReturnsError.message}`);
    }

    console.log('Successfully fetched pending tax returns count:', pendingTaxReturns);

    // Get active projects (todo, in_progress, or review)
    const { count: activeProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['todo', 'in_progress', 'review'] satisfies ProjectStatus[]);

    if (projectsError) throw new Error(`Failed to fetch active projects: ${projectsError.message}`);

    // Get upcoming deadlines (tasks due in the next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { count: upcomingDeadlines, error: deadlinesError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .lte('due_date', sevenDaysFromNow.toISOString())
      .gt('due_date', new Date().toISOString())
      .not('status', 'eq', 'completed');

    if (deadlinesError) throw new Error(`Failed to fetch upcoming deadlines: ${deadlinesError.message}`);

    return {
      totalActiveClients: totalActiveClients || 0,
      pendingTaxReturns: pendingTaxReturns || 0,
      activeProjects: activeProjects || 0,
      upcomingDeadlines: upcomingDeadlines || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
} 
```

### `src\lib\supabase\supabase-provider.tsx`

```typescript
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type SupabaseContextType = {
  supabase: SupabaseClient<Database>
  session: Session | null
}

const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-my-custom-header': 'american-dream-taxes-hub'
      }
    }
  }
)

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: createClient(),
  session: null
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
      } catch (error) {
        console.error('Error getting session:', error)
      }
    }

    getSession()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
    }
  }, [supabase, router])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

```

### `src\lib\supabase\supabase.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { type Database } from '@/types/database.types'

export const createClientHelper = (cookieStore?: any) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: cookieStore ? {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: any) {
					cookieStore.set({ name, value, ...options })
				},
				remove(name: string, options: any) {
					cookieStore.set({ name, value: '', ...options })
				},
			} : undefined,
			auth: {
				persistSession: true,
				storageKey: 'american-dream-taxes-auth',
			}
		}
	)
}
```

### `src\lib\supabase\tasks.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { toast } from "@/components/ui/use-toast"

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function updateTask(
  taskId: string, 
  updates: Partial<Database['public']['Tables']['tasks']['Row']>
) {
  // Prepare updates, removing any undefined or null values
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
  )

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...filteredUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)

  if (error) {
    toast({
      title: "Error updating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')

  if (error) {
    toast({
      title: "Error fetching tasks",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function createTask(
  taskData: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    toast({
      title: "Error creating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

```

### `src\lib\api\projects.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';
import { ProjectFormValues } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function createProject(
  projectData: ProjectFormValues
): Promise<Tables<'projects'> | null> {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      status: projectData.status || 'not_started',
      priority: projectData.priority || 'medium'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return project;
}

export async function createProjectFromTemplate(
  projectData: ProjectFormValues,
  templateId: string
): Promise<Tables<'projects'> | null> {
  const supabase = createClientComponentClient();
  
  const { data: project, error } = await supabase
    .rpc('create_project_from_template', {
      project_data: projectData,
      template_id: templateId
    });

  if (error) {
    console.error('Error creating project from template:', error);
    return null;
  }

  // Validate returned project has required fields
  if (!project || typeof project !== 'object' || !('id' in project)) {
    console.error('Invalid project data returned from RPC create_project_from_template');
    return null;
  }

  // Type assertion after validation
  return project as Tables<'projects'>;
}

```

### `src\lib\api\templates.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';

export async function getCategories(): Promise<Tables<'template_categories'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('template_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  }

  return data;
}

export async function getTemplates(): Promise<Tables<'project_templates'>[] | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return null;
  }

  return data;
}

export async function getTemplateWithTasks(
  templateId: string
): Promise<Tables<'project_templates'> & { tasks: Tables<'template_tasks'>[] } | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('project_templates')
    .select(`
      *,
      tasks: template_tasks (*)
    `)
    .eq('id', templateId)
    .single();

  if (error) {
    console.error('Error fetching template with tasks:', error);
    return null;
  }

  return data;
}

```

### `src\hooks\use-debounce.tsx`

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

```

### `src\hooks\use-mobile.tsx`

```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

### `src\hooks\use-protected-route.ts`

```typescript
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import type { UserRole } from '@/types/auth'

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[]
  redirectTo?: string
  isPublicRoute?: boolean
}

export function useProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
  isPublicRoute = false
}: UseProtectedRouteOptions = {}) {
  const { session, loading, checkRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // Allow public routes
    if (isPublicRoute) return

    // Redirect to login if not authenticated
    if (!session) {
      const returnUrl = encodeURIComponent(pathname || '')
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`)
      return
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some(role => checkRole(role))
      if (!hasAllowedRole) {
        router.replace('/unauthorized')
      }
    }
  }, [session, loading, allowedRoles, redirectTo, isPublicRoute, router, pathname, checkRole])

  return {
    isAuthenticated: !!session,
    isAuthorized: !allowedRoles || allowedRoles.some(role => checkRole(role)),
    isLoading: loading,
    user: session?.user
  }
} 
```

### `src\hooks\use-toast.ts`

```typescript
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

### `src\hooks\use-users.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type User = {
  id: string
  name?: string
  avatar_url?: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        // First get the current user's data
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          throw new Error('No authenticated user')
        }

        // Then fetch all profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .order('name')

        if (error) throw error

        // Process the profiles
        const processedUsers = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown User',
          avatar_url: profile.avatar_url
        }));

        setUsers(processedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        // On error, at least show the current user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUsers([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
            avatar_url: user.user_metadata?.avatar_url
          }])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  return { users, loading }
}
```

### `src\hooks\useAITasks.ts`

```typescript
import { useState } from 'react';
import { TaskCategory } from '@/lib/ai/tasks';

export function useAITasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function classifyTask(title: string, description: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/classify-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify task');
      }

      const data = await response.json();
      return data as {
        category: TaskCategory;
        suggestions: Array<{category: TaskCategory, confidence: number}>;
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    classifyTask,
    isLoading,
    error,
  };
}
```

### `src\hooks\useClientOnboarding.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ClientOnboardingWorkflow, WorkflowTemplate } from '@/types/hooks'

export function useClientOnboarding(clientId?: string) {
  const [workflow, setWorkflow] = useState<ClientOnboardingWorkflow | null>(null)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchWorkflow()
    }
    fetchTemplates()
  }, [clientId])

  async function fetchWorkflow() {
    if (!clientId) return

    try {
      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .select('*')
        .eq('client_id', clientId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      
      // Transform the data to include steps if progress exists
      if (data) {
        const progressData = data.progress ? JSON.parse(data.progress) : null
        const workflowData: ClientOnboardingWorkflow = {
          ...data,
          steps: progressData?.steps || []
        }
        setWorkflow(workflowData)
      } else {
        setWorkflow(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('name')

      if (error) throw error
      
      // Transform the templates data to parse steps JSON
      const transformedTemplates = (data || []).map(template => ({
        ...template,
        steps: Array.isArray(template.steps) 
          ? template.steps 
          : typeof template.steps === 'string'
            ? JSON.parse(template.steps)
            : []
      })) as WorkflowTemplate[]
      
      setTemplates(transformedTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function startWorkflow(clientId: string, templateId: number) {
    try {
      if (!clientId || !templateId) {
        throw new Error('Client ID and template ID are required')
      }

      const template = templates.find(t => t.id === templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const workflowData = {
        client_id: clientId,
        template_id: templateId,
        status: 'in_progress',
        progress: JSON.stringify({
          currentStep: 0,
          totalSteps: template.steps.length,
          completedSteps: [],
          steps: template.steps.map(step => ({
            ...step,
            status: 'pending'
          }))
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .insert([workflowData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        const progressData = JSON.parse(data[0].progress || '{}')
        const workflowWithSteps: ClientOnboardingWorkflow = {
          ...data[0],
          steps: progressData.steps || []
        }
        setWorkflow(workflowWithSteps)
        return workflowWithSteps
      }
      throw new Error('Failed to start workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<Omit<ClientOnboardingWorkflow, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setWorkflow(data[0])
        return data[0]
      }
      throw new Error('Failed to update workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteWorkflow(id: number) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const { error } = await supabase
        .from('client_onboarding_workflows')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWorkflow(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    workflow,
    templates,
    loading,
    error,
    startWorkflow,
    updateWorkflow,
    deleteWorkflow,
    refresh: fetchWorkflow
  }
}

```

### `src\hooks\useClients.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Client } from '@/types/clients'

export function useClients() {
  const [data, setData] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: clientsData, error: supabaseError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        // Transform the data to match our Client type
        const transformedClients = clientsData?.map((client) => ({
          ...client,
          contact_info: client.contact_info || {},
          tax_info: client.tax_info || {},
        })) as Client[]

        setData(transformedClients || [])
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [supabase])

  return { data, loading, error }
}

```

### `src\hooks\useDocuments.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Document = Database['public']['Tables']['client_documents']['Row']
type DocumentInsert = Database['public']['Tables']['client_documents']['Insert']

export const useDocuments = (clientId: string) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  const fetchDocuments = async () => {
    setIsLoading(true)
    const { data, error } = await supabaseClient
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data)
    }
    setIsLoading(false)
  }

  const uploadDocument = async (file: File, type: Document['document_type'], dueDate?: Date) => {
    // 1. Upload file to storage
    const { data: fileData, error: uploadError } = await supabaseClient
      .storage
      .from('client-documents')
      .upload(`${clientId}/${file.name}`, file)

    if (uploadError) throw uploadError

    // 2. Create document record
    const documentData: DocumentInsert = {
      client_id: clientId,
      document_name: file.name,
      document_type: type,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
      file_path: fileData?.path
    }

    const { data, error: dbError } = await supabaseClient
      .from('client_documents')
      .insert(documentData)
      .single()

    if (dbError) throw dbError

    await fetchDocuments()
    return data
  }

  const updateDocumentStatus = async (documentId: number, status: Document['status']) => {
    const { error } = await supabaseClient
      .from('client_documents')
      .update({ status })
      .eq('id', documentId)

    if (error) throw error
    await fetchDocuments()
  }

  return {
    documents,
    isLoading,
    uploadDocument,
    updateDocumentStatus,
    fetchDocuments
  }
}

```

### `src\hooks\useNotes.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Note } from '@/types/hooks'

export function useNotes(clientId?: string, projectId?: number, userId?: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [clientId, projectId, userId])

  async function fetchNotes() {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addNote({ content, ...rest }: Omit<Note, 'id' | 'created_at'>) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const noteData = {
        content,
        ...rest,
        created_at: new Date().toISOString(),
        client_id: clientId,
        user_id: userId,
        project_id: projectId
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setNotes(prev => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create note')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateNote(id: number, content: string) {
    try {
      if (!content) {
        throw new Error('Content is required')
      }

      const { data, error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', id)
        .select()

      if (error) throw error
      setNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteNote(id: number) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refresh: fetchNotes
  }
}

```

### `src\hooks\usePayrollServices.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PayrollService } from '@/types/hooks'

export function usePayrollServices(clientId?: string) {
  const [services, setServices] = useState<PayrollService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [clientId])

  async function fetchServices() {
    try {
      let query = supabase
        .from('payroll_services')
        .select('*')
        .order('created_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addService({ service_name, frequency, ...rest }: Omit<PayrollService, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!service_name || !frequency) {
        throw new Error('Service name and frequency are required')
      }

      const serviceData = {
        service_name,
        frequency,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('payroll_services')
        .insert([serviceData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setServices(prev => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create payroll service')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateService(
    id: number,
    updates: Partial<Omit<PayrollService, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('payroll_services')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setServices(prev => prev.map(service => service.id === id ? data[0] : service))
        return data[0]
      }
      throw new Error('Failed to update payroll service')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteService(id: number) {
    try {
      const { error } = await supabase
        .from('payroll_services')
        .delete()
        .eq('id', id)

      if (error) throw error
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    refresh: fetchServices
  }
}

```

### `src\hooks\useProjectAnalytics.ts`

```typescript
import { useCallback, useState } from 'react';
import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Project = Database['public']['Tables']['projects']['Row'];

function calculateCompletionRate(project: Project): number {
  if (!project.task_count || project.task_count === 0) return 0;
  return ((project.completed_tasks || 0) / project.task_count) * 100;
}

function assessProjectRisk(project: Project): string {
  const completionRate = calculateCompletionRate(project);
  if (completionRate < 30) return 'high';
  if (completionRate < 70) return 'medium';
  return 'low';
}

function predictDelay(project: Project): number {
  const completionRate = calculateCompletionRate(project);
  // Simple delay prediction based on completion rate
  if (completionRate < 50) return 5; // 5 days delay predicted
  if (completionRate < 80) return 2; // 2 days delay predicted
  return 0; // No delay predicted
}

function analyzeResourceUtilization(project: Project): number {
  // Simple resource utilization calculation
  const completionRate = calculateCompletionRate(project);
  return Math.min(100, completionRate * 1.2); // Adjust based on completion rate
}

function generateRecommendations(project: Project): string[] {
  const recommendations: string[] = [];
  const completionRate = calculateCompletionRate(project);
  
  if (completionRate < 30) {
    recommendations.push('Consider allocating more resources to this project');
  }
  if (project.status === 'blocked') {
    recommendations.push('Review and address project blockers');
  }
  if (!project.primary_manager) {
    recommendations.push('Assign a primary manager to improve project oversight');
  }
  
  return recommendations;
}

export function useProjectAnalytics() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const supabase = createClientComponentClient<Database>();

  const analyzeProjects = useCallback(async (projects: Project[]) => {
    setLoading(true);
    try {
      // Analyze project patterns and generate insights
      const projectInsights = projects.map(project => ({
        id: project.id,
        name: project.name,
        metrics: {
          completionRate: calculateCompletionRate(project),
          riskLevel: assessProjectRisk(project),
          predictedDelay: predictDelay(project),
          resourceUtilization: analyzeResourceUtilization(project)
        },
        recommendations: generateRecommendations(project)
      }));

      setInsights(projectInsights);
      return projectInsights;
    } catch (error) {
      console.error('Error analyzing projects:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    insights,
    analyzeProjects
  };
} 
```

### `src\hooks\useProjectFilters.ts`

```typescript
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import type { ProjectWithRelations } from '@/types/projects';
import type { ProjectStatus, Priority, ServiceCategory } from '@/types/hooks';
import { startOfDay, endOfDay } from 'date-fns';

export interface ProjectFilters {
  search: string;
  status: ProjectStatus[];
  priority: Priority[];
  service_category: ServiceCategory[];
  clientId: string;
  dateRange?: DateRange;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  groupBy: string;
}

export const defaultFilters: ProjectFilters = {
  search: '',
  status: [],
  priority: [],
  service_category: [],
  clientId: 'all',
  dateRange: undefined,
  sortBy: 'due_date',
  sortOrder: 'asc',
  groupBy: 'status'
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [error, setError] = useState<Error | null>(null);

  const updateFilters = (updates: Partial<ProjectFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filterProjects = (projects: ProjectWithRelations[]): ProjectWithRelations[] => {
    try {
      return projects.filter(project => {
        // Search filter
        if (filters.search && !matchesSearch(project, filters.search)) {
          return false;
        }

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(project.status)) {
          return false;
        }

        // Priority filter
        if (filters.priority.length > 0 && project.priority && !filters.priority.includes(project.priority as Priority)) {
          return false;
        }

        // Service category filter
        if (filters.service_category.length > 0 && project.service_type && !filters.service_category.includes(project.service_type as ServiceCategory)) {
          return false;
        }

        // Client filter
        if (filters.clientId !== 'all' && project.client_id !== filters.clientId) {
          return false;
        }

        // Date range filter
        if (filters.dateRange?.from) {
          const startDate = startOfDay(filters.dateRange.from);
          const endDate = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from);
          const projectDate = project.due_date ? new Date(project.due_date) : null;

          if (!projectDate || projectDate < startDate || projectDate > endDate) {
            return false;
          }
        }

        return true;
      });
    } catch (err) {
      console.error('Error filtering projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter projects'));
      return projects;
    }
  };

  const matchesSearch = (project: ProjectWithRelations, search: string): boolean => {
    const searchLower = search.toLowerCase();
    return (
      (project.name?.toLowerCase().includes(searchLower) || false) ||
      (project.description?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.full_name?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.company_name?.toLowerCase().includes(searchLower) || false)
    );
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    error
  };
}

```

### `src\hooks\useProjectForm.ts`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ProjectFormValues, projectSchema, ServiceType } from '@/lib/validations/project';
import { Database } from '@/types/database.types';
import { ProjectTemplate } from '@/types/projects';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

interface UseProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}

export function useProjectForm({ defaultValues, onSubmit }: UseProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      status: 'not_started',
      priority: 'medium',
      service_type: 'tax_return',
      tax_info: null,
      accounting_info: null,
      payroll_info: null,
      service_info: null,
      completed_tasks: 0,
      completion_percentage: 0,
      task_count: 0,
      ...defaultValues,
    },
  });

  const calculateProgress = () => {
    const fields = form.getValues();
    const requiredFields = [
      'name',
      'client_id',
      'service_type',
      'due_date',
    ];

    const serviceFields = {
      tax_return: ['tax_info'],
      bookkeeping: ['accounting_info'],
      payroll: ['payroll_info'],
      advisory: ['service_info']
    } as const;

    let completed = 0;
    let total = requiredFields.length;

    // Check basic required fields
    for (const field of requiredFields) {
      if (fields[field as keyof ProjectFormValues]) {
        completed++;
      }
    }

    // Check service-specific fields
    if (fields.service_type && serviceFields[fields.service_type]) {
      const serviceSpecificFields = serviceFields[fields.service_type];
      total += serviceSpecificFields.length;
      for (const field of serviceSpecificFields) {
        if (fields[field as keyof ProjectFormValues]) {
          completed++;
        }
      }
    }

    // Calculate percentage
    const percentage = (completed / total) * 100;
    setProgress(Math.round(percentage));
  };

  const onServiceTypeChange = (type: ServiceType) => {
    // Reset service-specific fields when type changes
    form.setValue('service_type', type);
    form.setValue('tax_info', null);
    form.setValue('accounting_info', null);
    form.setValue('payroll_info', null);
    form.setValue('service_info', null);
    calculateProgress();
  };

  const onTemplateSelect = (template: ProjectTemplate | null) => {
    if (!template) {
      form.setValue('template_id', null);
      return;
    }

    form.setValue('template_id', template.id);
    if (template.project_defaults) {
      const defaults = template.project_defaults as Partial<ProjectRow>;
      Object.entries(defaults).forEach(([key, value]) => {
        form.setValue(key as keyof ProjectFormValues, value);
      });
    }
    calculateProgress();
  };

  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      setIsSubmitting(true);
      const values = form.getValues();
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    progress,
    onServiceTypeChange,
    onTemplateSelect,
    onSubmit: handleSubmit,
    calculateProgress,
  };
}

```

### `src\hooks\useProjectManagement.ts`

```typescript
import { useState, useCallback, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format, startOfWeek, endOfWeek, addMonths } from 'date-fns';
import type { 
  ProjectWithRelations, 
  ServiceCategory, 
  TaxReturnType, 
  ProjectStatus, 
  Priority 
} from '@/types/projects';
import type { ReviewStatus } from '@/types/tasks';
import { useToast } from '@/components/ui/use-toast';
import { useProjectFilters } from './useProjectFilters';
import type { ProjectFilters } from './useProjectFilters';

export function useProjectManagement(): {
  projects: ProjectWithRelations[];
  loading: boolean;
  error: Error | null;
  filters: ProjectFilters;
  updateFilters: (updates: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  filterProjects: (projects: ProjectWithRelations[]) => ProjectWithRelations[];
  groupProjects: (projects: ProjectWithRelations[], groupBy: string) => { [key: string]: ProjectWithRelations[] };
  refresh: () => Promise<void>;
  bulkUpdateProjects: (projectIds: string[], updates: Partial<ProjectWithRelations>) => Promise<boolean>;
  archiveProjects: (projectIds: string[]) => Promise<boolean>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { filters, updateFilters, resetFilters, filterProjects: applyFilters } = useProjectFilters();

  const groupKeyMap = {
    status: (project: ProjectWithRelations) => project.status || 'No Status',
    service: (project: ProjectWithRelations) => project.service_category || 'Uncategorized',
    deadline: (project: ProjectWithRelations) => {
      if (!project.due_date) return 'No Due Date';
      const dueDate = new Date(project.due_date);
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);

      if (dueDate < today) return 'Overdue';
      if (dueDate <= weekEnd) return 'This Week';
      if (dueDate <= addMonths(today, 1)) return 'Next Month';
      return 'Later';
    },
    client: (project: ProjectWithRelations) => project.client?.name || 'No Client'
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          tasks:project_tasks(
            *,
            checklist_items(*),
            activity_log_entries(*)
          ),
          tax_return:tax_returns(*)
        `);

      if (fetchError) throw fetchError;

      const processedProjects = data.map(project => ({
        ...project,
        completion_percentage: calculateCompletionPercentage(project)
      }));

      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchProjects();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        fetchProjects
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [fetchProjects, supabase]);

  const calculateCompletionPercentage = (project: ProjectWithRelations): number => {
    if (!project.tasks?.length) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const groupProjects = useCallback((projects: ProjectWithRelations[], groupBy: string) => {
    const groupedProjects: { [key: string]: ProjectWithRelations[] } = {};
    const getGroupKey = groupKeyMap[groupBy as keyof typeof groupKeyMap] || groupKeyMap.status;

    projects.forEach(project => {
      const key = getGroupKey(project);
      if (!groupedProjects[key]) {
        groupedProjects[key] = [];
      }
      groupedProjects[key].push(project);
    });

    return groupedProjects;
  }, []);

  const bulkUpdateProjects = async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .in('id', projectIds);

      if (updateError) throw updateError;

      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  };

  const archiveProjects = async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived',
      updated_at: new Date().toISOString()
    });
  };

  const TAX_DEADLINES: Record<TaxReturnType, { normal: string; extended: string }> = {
    '1040': { normal: '04-15', extended: '10-15' },
    '1120': { normal: '04-15', extended: '10-15' },
    '1065': { normal: '03-15', extended: '09-15' },
    '1120S': { normal: '03-15', extended: '09-15' },
    '990': { normal: '05-15', extended: '11-15' },
    '941': { normal: 'quarterly', extended: 'N/A' },
    '940': { normal: '01-31', extended: 'N/A' },
    'other': { normal: '04-15', extended: '10-15' }
  };

  const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (new Date(deadlineDate) > today) {
        return deadlineDate;
      }
    }
    
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const getProjectDeadline = useCallback((project: ProjectWithRelations): Date | null => {
    if (project.due_date) {
      return new Date(project.due_date);
    }
    if (project.tax_info?.filing_deadline) {
      return new Date(project.tax_info.filing_deadline);
    }
    if (project.payroll_info?.next_payroll_date) {
      return new Date(project.payroll_info.next_payroll_date);
    }
    if (project.business_services_info?.due_date) {
      return new Date(project.business_services_info.due_date);
    }
    if (project.tax_info?.return_type) {
      const isExtended = project.tax_info.is_extended || false;
      return getDeadline(project.tax_info.return_type, isExtended);
    }
    return null;
  }, [getDeadline]);

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = (filters.search || '').toLowerCase();
      
      // Safely access potentially undefined properties
      const projectTitle = project?.title || '';
      const projectDesc = project?.description || '';
      const clientCompany = project?.client?.company_name || '';
      const clientName = project?.client?.full_name || '';
      const returnType = project?.tax_info?.return_type || '';
      
      const matchesSearch = !searchLower || (
        projectTitle.toLowerCase().includes(searchLower) ||
        projectDesc.toLowerCase().includes(searchLower) ||
        clientCompany.toLowerCase().includes(searchLower) ||
        clientName.toLowerCase().includes(searchLower) ||
        returnType.toLowerCase().includes(searchLower)
      );

      const matchesService = !filters.service?.length || 
        (project?.service_category && filters.service.includes(project.service_category));
      
      const matchesStatus = !filters.status?.length || 
        (project?.status && filters.status.includes(project.status));
      
      const matchesPriority = !filters.priority?.length || 
        (project?.priority && filters.priority.includes(project.priority));
      
      const matchesReturnType = !filters.returnType?.length || 
        (project?.tax_info?.return_type && filters.returnType.includes(project.tax_info.return_type));
      
      const matchesReviewStatus = !filters.reviewStatus?.length || 
        (project?.tax_info?.review_status && filters.reviewStatus.includes(project.tax_info.review_status));

      const deadline = getProjectDeadline(project);
      const matchesDueThisWeek = !filters.dueThisWeek || 
        (deadline && new Date(deadline) <= new Date(endOfWeek(new Date())));

      const matchesDueThisMonth = !filters.dueThisMonth || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 1)));

      const matchesDueThisQuarter = !filters.dueThisQuarter || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 3)));

      const matchesDateRange = !filters.dateRange || !deadline || 
        (deadline >= new Date(filters.dateRange.from) && deadline <= new Date(filters.dateRange.to));

      return (
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesPriority &&
        matchesReturnType &&
        matchesReviewStatus &&
        matchesDueThisWeek &&
        matchesDueThisMonth &&
        matchesDueThisQuarter &&
        matchesDateRange
      );
    });
  }, [filters, getProjectDeadline]);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    groupProjects,
    refresh: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}

```

### `src\hooks\useProjectSubmission.ts`

```typescript
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectFormValues, validateTaskDependencies, sortTasksByDependencies } from '@/lib/validations/project';

export const useProjectSubmission = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitProject = async (values: ProjectFormValues) => {
    setIsLoading(true);

    try {
      // Validate tasks before submission
      if (values.tasks?.length && !validateTaskDependencies(values.tasks)) {
        throw new Error('Invalid task dependencies');
      }

      // Sort tasks by dependencies to ensure correct order
      const sortedTasks = values.tasks ? sortTasksByDependencies(values.tasks) : [];

      // Prepare project data
      const projectData = {
        creation_type: values.creation_type,
        template_id: values.template_id,
        name: values.name.trim(),
        description: values.description?.trim(),
        client_id: values.client_id,
        status: values.status,
        priority: values.priority,
        due_date: values.due_date?.toISOString(),
        service_type: values.service_type,
        tax_info: values.tax_info || {},
        accounting_info: values.accounting_info || {},
        payroll_info: values.payroll_info || {},
        tax_return_id: values.tax_return_id,
        team_members: values.team_members || [],
        tasks: sortedTasks.map((task, index) => ({
          title: task.title.trim(),
          description: task.description?.trim(),
          priority: task.priority,
          dependencies: task.dependencies || [],
          order_index: index,
          assignee_id: task.assignee_id
        }))
      };

      // Submit project through API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create project');
      }

      toast.success('Project created successfully');
      onSuccess();
      return { data: responseData, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      console.error('Project creation error:', err);
      toast.error(message);
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitProject
  };
};

```

### `src\hooks\useProjectTabProgress.ts`

```typescript
import { UseFormReturn } from 'react-hook-form';

export function useProjectTabProgress(form: UseFormReturn<any>) {
  const getTabProgress = (tab: string): number => {
    const fields = {
      'basic-info': ['name', 'description', 'client_id', 'priority'],
      'service-details': ['service_type'],
      'tasks': ['tasks']
    };

    const tabFields = fields[tab as keyof typeof fields] || [];
    if (!tabFields.length) return 100;

    const completedFields = tabFields.filter(field => {
      const value = form.getValues(field);
      return value !== undefined && value !== '' && value !== null;
    });

    return Math.round((completedFields.length / tabFields.length) * 100);
  };

  return { getTabProgress };
} 
```

### `src\hooks\useProjectTemplates.ts`

```typescript
import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { ProjectTemplate, ProjectTemplateInput } from '@/types/projects'

export function useProjectTemplates() {
  const { supabase } = useSupabase()
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_templates')
        .select('*, template_tasks(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createTemplate = useCallback(async (template: ProjectTemplateInput) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .insert(template)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template')
    }
  }, [supabase])

  const updateTemplate = useCallback(async (id: string, updates: Partial<ProjectTemplateInput>) => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .update(updates)
        .eq('id', id)
        .select('*, template_tasks(*)')
        .single()

      if (error) throw error

      setTemplates(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template')
    }
  }, [supabase])

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template')
    }
  }, [supabase])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  }
}
```

### `src\hooks\useProjects.ts`

```typescript
'use client'

import { useCallback, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Tables } from '@/types/database.types'
import type { ProjectFormData } from '@/lib/validations/project'

export function useProjects() {
  const supabase = createClientComponentClient()
  const [sorting, setSorting] = useState({ column: 'created_at', direction: 'desc' })
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('projects')
      .select('*, tax_returns(*)', { count: 'exact' })

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value)
      }
    })

    // Apply sorting
    query = query.order(sorting.column, { ascending: sorting.direction === 'asc' })

    // Apply pagination
    const from = (pagination.page - 1) * pagination.pageSize
    query = query.range(from, from + pagination.pageSize - 1)

    return query
  }, [supabase, filters, pagination, sorting])

  const fetchProjects = useCallback(async () => {
    try {
      const query = buildQuery()
      const { data: projects, count, error } = await query

      if (error) throw error

      return { projects: projects || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { projects: [], count: 0 }
    }
  }, [buildQuery])

  const createProject = useCallback(async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert(data)
        .select()
        .single()

      if (error) throw error
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }, [supabase])

  return {
    fetchProjects,
    createProject,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
  }
}

```

### `src\hooks\useProjects.tsx`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { DbProject, ProjectWithRelations, ProjectInsert, ProjectResponse } from '@/types/projects';

export function useProjects(clientId?: string): {
  projects: ProjectWithRelations[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: ProjectInsert) => Promise<ProjectWithRelations>;
  updateProject: (id: string, updates: Partial<DbProject>) => Promise<ProjectWithRelations>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_info,
            contact_email,
            type,
            status
          ),
          tasks:tasks!tasks_project_id_fkey (
            id,
            title,
            description,
            status,
            priority,
            due_date,
            assignee_id,
            progress,
            category
          ),
          team_members:project_team_members!project_team_members_project_id_fkey (
            user:users (
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .order('due_date', { ascending: true })
        .neq('status', 'archived');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw new Error('Failed to fetch projects');
      }

      const projectsWithRelations = (projectsData as unknown as ProjectResponse[] | null)?.map(project => ({
        ...project,
        client: project.client || null,
        tasks: project.tasks || [],
        team_members: project.team_members?.map(tm => tm.user) || [],
        tax_info: project.tax_info || null,
        accounting_info: project.accounting_info || null,
        payroll_info: project.payroll_info || null,
        service_info: project.service_info || null
      })) || [];

      setProjects(projectsWithRelations);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching projects';
      console.error('Error in fetchProjects:', err);
      setError(errorMessage);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (project: ProjectInsert): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    const newProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

    setProjects(current => [...current, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<DbProject>): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');

    const updatedProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

    setProjects(current =>
      current.map(p => (p.id === id ? updatedProject : p))
    );

    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProjects(current => current.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
```

### `src\hooks\useServiceFields.ts`

```typescript
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues, ServiceType, ServiceCategory } from '@/types/hooks';

export function useServiceFields(form: UseFormReturn<ProjectFormValues>) {
  const handleServiceTypeChange = (currentType: ServiceType | ServiceCategory) => {
    if (currentType !== 'uncategorized') {
      // Reset specific service fields based on type
      switch (currentType) {
        case 'tax_return':
          form.setValue('tax_return_id', undefined);
          form.setValue('tax_return_status', undefined);
          break;
        case 'accounting':
          form.setValue('accounting_period', undefined);
          break;
        // Add other service type specific resets
      }
    }
  };

  const calculateProgress = (serviceType: string) => {
    // Progress calculation logic
    return 50; // Placeholder
  };

  const validateServiceSpecificFields = () => {
    const currentType = form.getValues('service_type');
    const currentTasks = form.getValues('tasks') || [];

    if (currentType !== 'uncategorized' && currentTasks.length > 0) {
      // Validation logic
      return true;
    }

    return false;
  };

  return {
    handleServiceTypeChange,
    calculateProgress,
    validateServiceSpecificFields
  };
}

```

### `src\hooks\useSmartProjectFilters.ts`

```typescript
import { useCallback } from 'react';
import { ProjectFilters } from '@/types/hooks';
import { ProjectWithRelations } from '@/types/projects';

export function useSmartProjectFilters() {
  const suggestFilters = useCallback(async (projects: ProjectWithRelations[]) => {
    try {
      // Analyze project patterns and suggest relevant filters
      const patterns = analyzeProjectPatterns(projects);
      
      return {
        recommendedFilters: patterns.map(pattern => ({
          type: pattern.type,
          value: pattern.value,
          confidence: pattern.confidence,
          reason: pattern.reason
        })),
        autoGroups: generateSmartGroups(projects)
      };
    } catch (error) {
      console.error('Error suggesting filters:', error);
      return null;
    }
  }, []);

  return {
    suggestFilters
  };
} 
```

### `src\hooks\useSmartTemplates.ts`

```typescript
import { useCallback } from 'react';
import { ProjectTemplate } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useSmartTemplates() {
  const supabase = createClientComponentClient();

  const suggestTemplate = useCallback(async (projectData: any) => {
    try {
      // Analyze project requirements and suggest best template
      const analysis = await analyzeProjectRequirements(projectData);
      const recommendations = generateTemplateRecommendations(analysis);
      
      return {
        suggestedTemplate: recommendations.bestMatch,
        alternatives: recommendations.alternatives,
        customizations: recommendations.suggestedCustomizations
      };
    } catch (error) {
      console.error('Error suggesting template:', error);
      return null;
    }
  }, [supabase]);

  return {
    suggestTemplate
  };
} 
```

### `src\hooks\useStorage.ts`

```typescript
import { useState } from 'react';
import { StorageService } from '@/lib/storage/storage';
import { type FileObject } from '@supabase/storage-js';

interface UseStorageReturn {
  uploadFile: (file: File, path: string) => Promise<FileObject | null>;
  downloadFile: (path: string) => Promise<Blob | null>;
  deleteFile: (path: string) => Promise<boolean>;
  listFiles: (prefix?: string) => Promise<FileObject[] | null>;
  getPublicUrl: (path: string) => string | null;
  loading: boolean;
  error: Error | null;
}

export function useStorage(): UseStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const storageService = StorageService.getInstance();

  const handleOperation = async <T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    return handleOperation(
      () => storageService.uploadFile(file, path),
      'Error uploading file'
    );
  };

  const downloadFile = async (path: string) => {
    return handleOperation(
      () => storageService.downloadFile(path),
      'Error downloading file'
    );
  };

  const deleteFile = async (path: string) => {
    return handleOperation(
      () => storageService.deleteFile(path),
      'Error deleting file'
    );
  };

  const listFiles = async (prefix?: string) => {
    return handleOperation(
      () => storageService.listFiles(prefix),
      'Error listing files'
    );
  };

  const getPublicUrl = (path: string) => {
    try {
      return storageService.getPublicUrl(path);
    } catch (err) {
      console.error('Error getting public URL:', err);
      setError(err instanceof Error ? err : new Error('Error getting public URL'));
      return null;
    }
  };

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    getPublicUrl,
    loading,
    error,
  };
}

```

### `src\hooks\useTaskManagement.ts`

```typescript
'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { TaskSchema } from '@/types/tasks'

export function useTaskManagement() {
  const form = useForm<{ tasks: TaskSchema[] }>()

  const validateTaskDependencies = useCallback((tasks: TaskSchema[]) => {
    const errors: Record<string, { message: string; type: string }> = {}
    
    tasks.forEach(task => {
      // Validate dates
      if (task.start_date && isNaN(new Date(task.start_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid start date format',
          type: 'date'
        }
      }
      
      if (task.due_date && isNaN(new Date(task.due_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid due date format',
          type: 'date'
        }
      }

      // Validate date order
      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date)
        const due = new Date(task.due_date)
        if (start > due) {
          errors[task.id] = {
            message: 'Start date must be before due date',
            type: 'date'
          }
        }
      }
    })

    return errors
  }, [])

  const addTask = useCallback((task: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const newId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
    
    const newTask: TaskSchema = {
      id: task.id || newId,
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dependencies: task.dependencies || [],
      start_date: task.start_date,
      due_date: task.due_date
    }

    const errors = validateTaskDependencies([...currentTasks, newTask])
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', [...currentTasks, newTask])
    return { success: true }
  }, [form, validateTaskDependencies])

  const removeTask = useCallback((taskId: string) => {
    const currentTasks = form.getValues('tasks') || []
    form.setValue('tasks', currentTasks.filter(t => t.id !== taskId))
  }, [form])

  const updateTask = useCallback((taskId: string, updates: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const taskIndex = currentTasks.findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) return { success: false, error: 'Task not found' }

    const updatedTask = { ...currentTasks[taskIndex], ...updates }
    const updatedTasks = [...currentTasks]
    updatedTasks[taskIndex] = updatedTask

    const errors = validateTaskDependencies(updatedTasks)
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', updatedTasks)
    return { success: true }
  }, [form, validateTaskDependencies])

  return {
    form,
    addTask,
    removeTask,
    updateTask
  }
}

```

### `src\hooks\useTaskValidation.ts`

```typescript
import { useState } from 'react';
import { type TaskSchema } from '@/lib/validations/project';

export type TaskDependencyError = Record<string, string>;

export const useTaskValidation = () => {
  const [taskDependencyErrors, setTaskDependencyErrors] = useState<TaskDependencyError>({});

  const detectCircularDependencies = (tasks: TaskSchema[], taskId: string, visited: Set<string>, path: string[]): boolean => {
    if (visited.has(taskId)) {
      if (path.includes(taskId)) {
        // Found a circular dependency
        const cycle = path.slice(path.indexOf(taskId));
        cycle.push(taskId);
        return true;
      }
      return false;
    }

    visited.add(taskId);
    path.push(taskId);

    const task = tasks.find(t => t.title === taskId);
    if (task?.dependencies) {
      for (const depId of task.dependencies) {
        if (detectCircularDependencies(tasks, depId, visited, path)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  const validateTaskDependencies = (tasks: TaskSchema[] | undefined) => {
    if (!tasks || tasks.length === 0) return true;
    
    const errors: TaskDependencyError = {};
    
    tasks.forEach(task => {
      // Ensure dependencies is an array
      if (task.dependencies && !Array.isArray(task.dependencies)) {
        errors[task.title] = 'Dependencies must be an array';
        return;
      }

      // Validate dependency IDs exist in the task list
      if (task.dependencies) {
        const invalidDeps = task.dependencies.filter(dep => 
          !tasks.some(t => t.title === dep)
        );
        if (invalidDeps.length > 0) {
          errors[task.title] = `Invalid dependencies: ${invalidDeps.join(', ')}`;
          return;
        }

        // Check for circular dependencies
        const visited = new Set<string>();
        if (detectCircularDependencies(tasks, task.title, visited, [])) {
          errors[task.title] = 'Circular dependency detected';
          return;
        }
      }

      // Validate task order if provided
      if (task.order_index !== undefined) {
        const duplicateOrder = tasks.some(t => 
          t !== task && t.order_index === task.order_index
        );
        if (duplicateOrder) {
          errors[task.title] = 'Duplicate task order detected';
        }
      }
    });

    setTaskDependencyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    taskDependencyErrors,
    validateTaskDependencies,
  };
};

```

### `src\hooks\useTasks.ts`

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskWithRelations, TaskFormData } from '@/types/tasks'
import { supabase } from '@/lib/supabase/client'

const TASKS_QUERY_KEY = 'tasks'

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading, error } = useQuery<TaskWithRelations[]>({
    queryKey: [TASKS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:users(*)
        `)
      if (error) throw error
      return data
    }
  })

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: TaskFormData) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] })
      const previousTasks = queryClient.getQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY])
      
      const optimisticTask = {
        id: crypto.randomUUID(),
        ...newTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      queryClient.setQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY], old => [
        optimisticTask,
        ...(old || [])
      ])

      return { previousTasks }
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY], context?.previousTasks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: async (task: Partial<TaskWithRelations> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', task.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] })
      const previousTasks = queryClient.getQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY])

      queryClient.setQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY], old => 
        old?.map(task => task.id === updatedTask.id ? { ...task, ...updatedTask } : task) || []
      )

      return { previousTasks }
    },
    onError: (_err, _updatedTask, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY], context?.previousTasks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    }
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
      if (error) throw error
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] })
      const previousTasks = queryClient.getQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY])

      queryClient.setQueryData<TaskWithRelations[]>([TASKS_QUERY_KEY], old => 
        old?.filter(task => task.id !== taskId) || []
      )

      return { previousTasks }
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData([TASKS_QUERY_KEY], context?.previousTasks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    }
  })

  return {
    tasks: tasks || [],
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading
  }
}

```

### `src\hooks\useTaxProjectManagement.ts`

```typescript
'use client'

import { useState, useCallback } from 'react';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ProjectWithRelations, TaxReturnType } from '@/types/projects';

// Constants for tax deadlines
const TAX_DEADLINES = {
  '1040': {
    normal: '04-15',
    extended: '10-15'
  },
  '1120': {
    normal: '03-15',
    extended: '09-15'
  },
  '1065': {
    normal: '03-15',
    extended: '09-15'
  },
  '1120S': {
    normal: '03-15',
    extended: '09-15'
  }
};

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

export function useTaxProjectManagement() {
  const [view, setView] = useState<'deadline' | 'return_type' | 'review_status'>('deadline');

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = startOfDay(new Date());
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (isAfter(deadlineDate, today)) {
        return deadlineDate;
      }
    }
    
    // If all deadlines have passed, return first deadline of next year
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const groupProjectsByDeadline = useCallback((projects: ProjectWithRelations[]) => {
    const groups: Record<string, ProjectWithRelations[]> = {
      'Due This Week': [],
      'Due This Month': [],
      'Due Later': [],
      'Past Due': [],
    };

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);

    projects.forEach(project => {
      if (!project.tax_info?.filing_deadline) return;

      const deadline = new Date(project.tax_info.filing_deadline);
      
      if (isBefore(deadline, today)) {
        groups['Past Due'].push(project);
      } else if (isBefore(deadline, nextWeek)) {
        groups['Due This Week'].push(project);
      } else if (isBefore(deadline, nextMonth)) {
        groups['Due This Month'].push(project);
      } else {
        groups['Due Later'].push(project);
      }
    });

    return groups;
  }, []);

  const groupProjectsByReturnType = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const returnType = project.tax_info?.return_type || 'Other';
      if (!groups[returnType]) {
        groups[returnType] = [];
      }
      groups[returnType].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReviewStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const status = project.tax_info?.review_status || 'Not Started';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  return {
    view,
    setView,
    getDeadline,
    getNextEstimatedTaxDeadline,
    groupProjectsByDeadline,
    groupProjectsByReturnType,
    groupProjectsByReviewStatus,
  };
}

```

### `src\hooks\useTaxReturns.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TaxReturn } from '@/types/hooks'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/types/database.types'

export function useTaxReturns(clientId?: string) {
  const supabase = createClientComponentClient<Database>()
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchTaxReturns()
    } else {
      setTaxReturns([])
      setLoading(false)
    }
  }, [session, clientId])

  async function fetchTaxReturns() {
    try {
      let query = supabase
        .from('tax_returns')
        .select('*')
        .order('due_date', { ascending: true })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      setTaxReturns(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addTaxReturn({
    filing_type,
    status,
    tax_year,
    ...rest
  }: Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!filing_type || !status || tax_year === undefined) {
        throw new Error('Filing type, status, and tax year are required')
      }

      if (!session) {
        throw new Error('Please sign in to add tax returns')
      }

      const taxReturnData = {
        filing_type,
        status,
        tax_year: typeof tax_year === 'string' ? parseInt(tax_year, 10) : tax_year,
        ...rest,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .insert([{
          ...taxReturnData,
          filing_deadline: rest.filing_deadline,
          extension_filed: rest.extension_filed
        }])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => [data[0], ...prev])
        toast({
          title: 'Success',
          description: 'Tax return added successfully'
        })
        return data[0]
      }
      throw new Error('Failed to create tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function updateTaxReturn(
    id: number,
    updates: Partial<Omit<TaxReturn, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!session) {
        throw new Error('Please sign in to update tax returns')
      }

      const updateData = {
        ...updates,
        tax_year: updates.tax_year 
          ? (typeof updates.tax_year === 'string' ? parseInt(updates.tax_year, 10) : updates.tax_year)
          : undefined,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tax_returns')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setTaxReturns(prev => prev.map(taxReturn => 
          taxReturn.id === id ? data[0] : taxReturn
        ))
        toast({
          title: 'Success',
          description: 'Tax return updated successfully'
        })
        return data[0]
      }
      throw new Error('Failed to update tax return')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  async function deleteTaxReturn(id: number) {
    try {
      if (!session) {
        throw new Error('Please sign in to delete tax returns')
      }

      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTaxReturns(prev => prev.filter(taxReturn => taxReturn.id !== id))
      toast({
        title: 'Success',
        description: 'Tax return deleted successfully'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      })
      throw err
    }
  }

  return {
    taxReturns,
    loading,
    error,
    addTaxReturn,
    updateTaxReturn,
    deleteTaxReturn,
    refresh: fetchTaxReturns
  }
}

```

### `src\hooks\useTemplateTasks.ts`

```typescript
import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from 'src/lib/supabase/supabase-provider'
import { TemplateTask } from 'src/types/hooks'

export function useTemplateTasks(templateId: string) {
  const { supabase } = useSupabase()
  const [tasks, setTasks] = useState<TemplateTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('template_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index', { ascending: true })

      if (error) throw error

      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch template tasks'))
    } finally {
      setLoading(false)
    }
  }, [supabase, templateId])

  const createTask = useCallback(async (task: Omit<TemplateTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .insert(task)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => [...prev, data])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template task')
    }
  }, [supabase])

  const updateTask = useCallback(async (id: string, updates: Partial<TemplateTask>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template task')
    }
  }, [supabase])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('template_tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template task')
    }
  }, [supabase])

  const reorderTask = useCallback(async (taskId: string, newOrderIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update({ order_index: newOrderIndex })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      await fetchTasks() // Refresh the list to get the correct order
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reorder template task')
    }
  }, [supabase, fetchTasks])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    refreshTasks: fetchTasks,
  }
}

```

### `src\hooks\useTimeEntries.ts`

```typescript
import { useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { TimeEntry, TimeEntryWithRelations } from '@/types/hooks'
import { Task, TaskWithRelations } from '@/types/tasks'
import { Project, ProjectWithRelations } from '@/types/hooks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const useTimeEntries = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

  const fetchTimeEntries = useCallback(async (
    filters?: {
      userId?: string
      taskId?: string
      projectId?: string
      startDate?: string
      endDate?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          task:tasks(*),
          project:projects(*),
          user:users(*)
        `)

      if (filters?.userId) query = query.eq('user_id', filters.userId)
      if (filters?.taskId) query = query.eq('task_id', filters.taskId)
      if (filters?.projectId) query = query.eq('project_id', filters.projectId)
      if (filters?.startDate) query = query.gte('start_time', filters.startDate)
      if (filters?.endDate) query = query.lte('end_time', filters.endDate)
      if (filters?.billable !== undefined) query = query.eq('billable', filters.billable)

      const { data, error } = await query

      if (error) throw error

      setTimeEntries(data as TimeEntryWithRelations[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const startTimeEntry = useCallback(async (
    entryData: {
      task_id?: string
      project_id?: string
      description?: string
      billable?: boolean
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      // Check for any active time entry
      const { data } = await supabase
        .from('time_entries')
        .select('*')
        .is('end_time', null)

      const active = data?.find(entry => entry.start_time && !entry.end_time)

      if (active) {
        throw new Error('An active time entry already exists. Please stop it first.')
      }

      const { data: userData } = await supabase.auth.getUser()

      const { data: newEntry, error } = await supabase
        .from('time_entries')
        .insert({
          ...entryData,
          start_time: new Date().toISOString(),
          end_time: null,
          user_id: userData.user?.id
        })
        .select()

      if (error) throw error

      setTimeEntries(prev => [...prev, newEntry[0]])
      return newEntry[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const stopTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ 
          end_time: new Date().toISOString() 
        })
        .eq('id', entryId)
        .select()

      if (error) throw error

      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, end_time: data[0].end_time } 
            : entry
        )
      )

      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteTimeEntry = useCallback(async (entryId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    timeEntries,
    loading,
    error,
    fetchTimeEntries,
    startTimeEntry,
    stopTimeEntry,
    deleteTimeEntry,
    setTimeEntries
  }
}

```

### `src\hooks\useUsers.ts`

```typescript
import { useState, useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { DbUser, DbUserInsert, DbUserUpdate, UserWithRelations } from '@/types/users'

export function useUsers() {
  const supabase = useSupabase()
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createUser = useCallback(async (userData: DbUserInsert) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) setUsers(prev => [...prev, data[0]])
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateUser = useCallback(async (userId: string, updates: DbUserUpdate) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) {
        setUsers(prev => 
          prev.map(user => user.id === userId ? { ...user, ...data[0] } : user)
        )
      }
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete user'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}

```

### `src\hooks\useWorkflows.ts`

```typescript
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { 
  DbWorkflowTemplate,
  DbWorkflowTemplateInsert,
  WorkflowTemplateWithRelations,
  WorkflowStep,
  WorkflowStatus,
  WORKFLOW_STATUS
} from '@/types/workflows'

interface CreateWorkflowRequest {
  name: string
  description?: string | null
  steps: WorkflowStep[]
}

interface UseWorkflowsOptions {
  initialFilters?: {
    status?: WorkflowStatus
    search?: string
  }
  pageSize?: number
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<WorkflowTemplateWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState(options.initialFilters || {})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(options.pageSize || 10)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchWorkflows()
  }, [filters, page, pageSize])

  async function fetchWorkflows() {
    try {
      let query = supabase
        .from('workflow_templates')
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      // Execute query
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkflows(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'))
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkflow(workflowData: CreateWorkflowRequest): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: createError } = await supabase
        .from('workflow_templates')
        .insert({
          name: workflowData.name,
          description: workflowData.description,
          steps: workflowData.steps
        } satisfies DbWorkflowTemplateInsert)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (createError) throw createError

      setWorkflows(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create workflow')
      }
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<DbWorkflowTemplate>
  ): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: updateError } = await supabase
        .from('workflow_templates')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (updateError) throw updateError

      setWorkflows(prev =>
        prev.map(workflow =>
          workflow.id === id ? data : workflow
        )
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to update workflow')
      }
    }
  }

  async function deleteWorkflow(id: number): Promise<{ error: Error | null }> {
    try {
      const { error: deleteError } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting workflow:', err)
      return { 
        error: err instanceof Error ? err : new Error('Failed to delete workflow')
      }
    }
  }

  return {
    workflows,
    loading,
    error,
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
}

```

### `src\app\dashboard\layout.tsx`

```typescript
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  )
}
```

### `src\app\dashboard\page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { getDashboardMetrics } from '@/lib/supabase/dashboardQueries'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  try {
    const metrics = await getDashboardMetrics();
    return <DashboardTabs {...metrics} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Return a fallback UI with zero values and error message
    return (
      <DashboardTabs 
        totalActiveClients={0}
        pendingTaxReturns={0}
        activeProjects={0}
        upcomingDeadlines={0}
        errorTitle="Error Loading Dashboard"
        errorMessage="Unable to load dashboard metrics. Please try again later."
      />
    );
  }
}

```

### `src\components\dashboard\dashboard-tabs.tsx`

```typescript
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TaskQueue } from '@/components/dashboard/task-queue'
import { ErrorView } from '@/components/dashboard/error-view'

interface DashboardTabsProps {
  totalActiveClients: number
  pendingTaxReturns: number
  activeProjects: number
  upcomingDeadlines: number
  errorTitle?: string
  errorMessage?: string
}

export function DashboardTabs({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
  errorTitle,
  errorMessage,
}: DashboardTabsProps) {
  if (errorTitle && errorMessage) {
    return <ErrorView title={errorTitle} message={errorMessage} />
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="queue">Task Queue</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Overview
          totalActiveClients={totalActiveClients}
          pendingTaxReturns={pendingTaxReturns}
          activeProjects={activeProjects}
          upcomingDeadlines={upcomingDeadlines}
        />
      </TabsContent>
      <TabsContent value="activity">
        <RecentActivity />
      </TabsContent>
      <TabsContent value="queue">
        <TaskQueue />
      </TabsContent>
    </Tabs>
  )
} 
```

### `src\components\dashboard\error-view.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface ErrorViewProps {
  title: string
  message: string
}

export function ErrorView({ title, message }: ErrorViewProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p>{message}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="w-fit"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  )
} 
```

### `src\components\dashboard\focus-now-dashboard.tsx`

```typescript
'use client'

export function FocusNowDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Focus Now Dashboard</h2>
      {/* Add your Focus Now Dashboard implementation here */}
    </div>
  )
}

```

### `src\components\dashboard\overview.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OverviewProps {
  totalActiveClients: number
  pendingTaxReturns: number
  activeProjects: number
  upcomingDeadlines: number
}

export function Overview({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
}: OverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActiveClients}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tax Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTaxReturns}</div>
          <p className="text-xs text-muted-foreground">Not started or gathering documents</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">Todo, in progress, or review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Due within 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
} 
```

### `src\components\dashboard\recent-activity.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Activity tracking will be implemented in future phases.
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 
```

### `src\components\dashboard\revenue-card.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/line-chart"

interface RevenueCardProps {
  revenue: number
  percentageChange: number
  data: number[]
}

export function RevenueCard({ revenue, percentageChange, data }: RevenueCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <LineChart 
            data={data}
            className="h-full w-full"
            pathClassName="stroke-[hsl(var(--chart-1))]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

```

### `src\components\dashboard\smart-queue.tsx`

```typescript
'use client'

export function SmartQueue() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Smart Queue</h2>
      {/* Add your Smart Queue implementation here */}
    </div>
  )
}

```

### `src\components\dashboard\subscriptions-card.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/bar-chart"

interface SubscriptionsCardProps {
  count: number
  percentageChange: number
  data: number[]
}

export function SubscriptionsCard({ count, percentageChange, data }: SubscriptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <BarChart 
            data={data}
            className="h-full w-full"
            pathClassName="fill-[hsl(var(--chart-2))]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

```

### `src\components\dashboard\task-queue.tsx`

```typescript
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TaskQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Queue</CardTitle>
        <CardDescription>
          Your upcoming and pending tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Review Q1 Financial Statements
              </p>
              <p className="text-sm text-muted-foreground">
                Due in 2 days
              </p>
            </div>
            <Badge>High Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Prepare Tax Returns for Smith Co
              </p>
              <p className="text-sm text-muted-foreground">
                Due in 5 days
              </p>
            </div>
            <Badge variant="secondary">Medium Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Client Meeting: ABC Corp
              </p>
              <p className="text-sm text-muted-foreground">
                Tomorrow at 2 PM
              </p>
            </div>
            <Badge variant="outline">Low Priority</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
```

### `src\types\auth.ts`

```typescript
import { Database } from './database.types'

// Use database types for user role
export type UserRole = Database['public']['Enums']['user_role']

// Use database types for user
export type User = {
  id: string
  email: string
  role: UserRole
  full_name?: string | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

// Strongly type the session
export type Session = {
  user: User
  expires_at: number
  access_token?: string
  refresh_token?: string
}

// Auth state with proper error typing
export type AuthState = {
  session: Session | null
  loading: boolean
  error: AuthError | null
}

// Form data with validation
export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  email: string
  password: string
  full_name: string
  role: UserRole
}

// Type guard for checking if user is authenticated
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && 
         typeof session.user === 'object' && 
         typeof session.user.id === 'string' &&
         typeof session.user.email === 'string' &&
         typeof session.expires_at === 'number' &&
         session.expires_at > Date.now() / 1000
}

// Type guard for checking user role
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role
}

// Error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired')
    this.name = 'SessionExpiredError'
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('Unauthorized access')
    this.name = 'UnauthorizedError'
  }
}

// Auth guard type
export type AuthGuard = {
  requireAuth: boolean
  allowedRoles?: UserRole[]
} 
```

### `src\types\clients.ts`

```typescript
import type { Database } from './database.types'
import type { Json } from './database.types'
import { z } from 'zod'
import { clientFormSchema } from '@/lib/validations/client'

// Database types
export type DbClient = Database['public']['Tables']['clients']['Row']
export type DbClientInsert = Database['public']['Tables']['clients']['Insert']
export type DbClientUpdate = Database['public']['Tables']['clients']['Update']
export type DbClientContactDetails = Database['public']['Tables']['client_contact_details']['Row']

// Enums from database
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type FilingType = Database['public']['Enums']['filing_type']

export interface Dependent {
  name: string
  ssn?: string | null
  relationship?: string | null
  birth_date?: string | null
}

export interface PreviousReturn {
  year: number
  filed_date: string
  preparer?: string | null
  notes?: string | null
}

export interface TaxInfo {
  filing_status?: string | null
  tax_id?: string | null
  tax_year?: number | null
  last_filed_date?: string | null
  filing_type?: FilingType | null
  tax_id_type?: 'ssn' | 'ein' | null
  dependents?: Dependent[] | null
  previous_returns?: PreviousReturn[] | null
}

// Form data type that matches our schema
export type ClientFormData = z.infer<typeof clientFormSchema>

// Enhanced client type with relationships
export interface ClientWithRelations extends Omit<DbClient, 'tax_info'> {
  tax_info: TaxInfo | null
  contact_details?: DbClientContactDetails | null
  documents?: Database['public']['Tables']['client_documents']['Row'][]
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][]
  assigned_preparer?: Database['public']['Tables']['users']['Row'] | null
  tax_returns?: Database['public']['Tables']['tax_returns']['Row'][]
  projects?: Database['public']['Tables']['projects']['Row'][]
}

export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('filing_status' in value) || typeof value.filing_status === 'string' || value.filing_status === null) &&
    (!('tax_id' in value) || typeof value.tax_id === 'string' || value.tax_id === null) &&
    (!('tax_year' in value) || typeof value.tax_year === 'number' || value.tax_year === null)
}

export function isDbClient(client: unknown): client is DbClient {
  return client !== null &&
    typeof client === 'object' &&
    'id' in client &&
    'contact_email' in client &&
    'status' in client
}

// Conversion utilities
export function toClientFormData(client: DbClient): ClientFormData {
  const {
    created_at,
    updated_at,
    ...formData
  } = client
  
  const taxInfo = isTaxInfo(client.tax_info) ? client.tax_info : null

  return {
    ...formData,
    tax_info: taxInfo,
  } as ClientFormData
}

export function toDbClient(formData: ClientFormData): Omit<DbClientInsert, 'id'> {
  const {
    id, // Exclude id as it's handled by the database
    tax_info,
    ...rest
  } = formData

  // Ensure all required fields are present with defaults
  const dbClient: Omit<DbClientInsert, 'id'> = {
    ...rest,
    contact_email: rest.contact_email,
    status: rest.status,
    tax_info: tax_info as Json,
    // Add any other required fields with defaults
    type: rest.type || null,
    accounting_method: rest.accounting_method || null,
    business_type: rest.business_type || null,
    company_name: rest.company_name || null,
    document_deadline: rest.document_deadline || null,
    fiscal_year_end: rest.fiscal_year_end || null,
    industry_code: rest.industry_code || null,
    last_contact_date: rest.last_contact_date || null,
    last_filed_date: rest.last_filed_date || null,
    next_appointment: rest.next_appointment || null,
    primary_contact_name: rest.primary_contact_name || null,
    tax_id: rest.tax_id || null,
    tax_return_status: rest.tax_return_status || null,
    user_id: rest.user_id || null,
    assigned_preparer_id: rest.assigned_preparer_id || null,
  }

  return dbClient
}

// Constants
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ClientStatus>

export const CLIENT_TYPE = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const satisfies Record<string, ClientType>

// Helper functions for type checking
export function isValidClientStatus(status: string): status is ClientStatus {
  return Object.values(CLIENT_STATUS).includes(status as ClientStatus)
}

export function isValidClientType(type: string): type is ClientType {
  return Object.values(CLIENT_TYPE).includes(type as ClientType)
}

// Helper function for null safety
export function ensureNullable<T>(value: T | undefined): T | null {
  return value === undefined ? null : value
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
      activity_log_entries: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          task_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "user_task_load"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_entries_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          id: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          id?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contact_details: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contact_details_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          id: string
          reminder_sent: boolean | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          id?: string
          reminder_sent?: boolean | null
          status: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          id?: string
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      client_onboarding_workflows: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          progress: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          progress?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
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
          onboarding_notes: string | null
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

... (file truncated, showing 500 of 1905 lines) ...

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

### `src\types\documents.ts`

```typescript
export type Document = {
  id?: string
  project_id?: string
  title: string
  file_path: string
  uploaded_at?: string
  description?: string
  tags?: string[]
  category?: string
} 
```

### `src\types\hooks.ts`

```typescript
import { Project, ProjectTemplate, ProjectFormValues } from './projects'
import { Task, TaskStatus, ReviewStatus } from './tasks'
import { Client } from './clients'
import { Database } from './database.types'

// Re-export database enums
export type ProjectStatus = Database['public']['Enums']['project_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type ServiceType = Database['public']['Enums']['service_type']

// Re-export all types to ensure they are available
export type {
  Project,
  ProjectTemplate,
  ProjectFormValues,
  Task,
  TaskStatus,
  ReviewStatus,
  Client,
  Database
}

export type WorkflowTemplate = {
  id: string
  name: string
  description?: string | null
  steps: Array<{
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
  }>
  created_at?: string | null
}

export type TemplateTask = {
  id: string
  title: string
  description: string
  order_index: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template_id: string
  dependencies: string[]
  created_at: string
  updated_at: string
}

export type TaxReturn = {
  id?: string
  project_id?: string
  tax_year: number
  filing_type?: string
  status?: string
  filing_deadline?: string
  extension_filed?: boolean
  created_at?: string
  updated_at?: string
}

export type WorkflowStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type WorkflowTask = Task & { workflow_id?: string }

export type ClientOnboardingWorkflow = Database['public']['Tables']['client_onboarding_workflows']['Row'] & {
  steps?: Array<{
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
}

export type Document = Database['public']['Tables']['client_documents']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'] | null
  client?: Database['public']['Tables']['clients']['Row'] | null
}

export type DocumentFormData = Omit<Document, 'id' | 'uploaded_at'>

export type Note = Database['public']['Tables']['notes']['Row']

export type PayrollService = Database['public']['Tables']['payroll_services']['Row']

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ServiceCategory = 'tax_returns' | 'payroll' | 'accounting' | 'tax_planning' | 'compliance' | 'uncategorized'

export type ProjectFilters = {
  search?: string
  service?: string[]
  serviceType?: string[]
  service_category?: string[]
  status?: string[]
  priority?: string[]
  dateRange?: { from: string; to: string }
  dueDateRange?: { from: Date; to: Date }
  clientId?: string
  teamMemberId?: string
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
  returnType?: string[]
  reviewStatus?: string[]
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
}

export type ProjectAnalytics = {
  completionRate: number
  riskLevel: string
  predictedDelay: number
  resourceUtilization: number
  recommendations: string[]
}

```

### `src\types\notes.ts`

```typescript
export type Note = {
  id?: string
  project_id?: string
  content: string
  created_at?: string
  updated_at?: string
  author_id?: string
  tags?: string[]
  category?: string
} 
```

### `src\types\projects.ts`

```typescript
import { Database } from './database.types';
import type { Json } from './database.types';
import { z } from 'zod';
import { projectSchema } from '@/lib/validations/project';

// Database types
export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

// Enums from database
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type ServiceType = Database['public']['Enums']['service_type'];
export type TaskPriority = Database['public']['Enums']['task_priority'];

// Strongly typed JSON fields
export interface TaxInfo {
  return_type?: Database['public']['Enums']['filing_type']
  filing_status?: string
  tax_year?: number
  due_date?: string
  extension_date?: string
  estimated_refund?: number
  estimated_liability?: number
  notes?: string
}

export interface AccountingInfo {
  period_start?: string
  period_end?: string
  accounting_method?: 'cash' | 'accrual'
  fiscal_year_end?: string
  last_reconciliation_date?: string
  chart_of_accounts_setup?: boolean
  software_used?: string
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

export interface PayrollInfo {
  payroll_schedule?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly'
  employee_count?: number
  last_payroll_date?: string
  next_payroll_date?: string
  payroll_provider?: string
  notes?: string
}

export interface ServiceInfo {
  service_category?: string
  frequency?: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  last_service_date?: string
  next_service_date?: string
  special_instructions?: string
  notes?: string
}

// Form data type that matches our schema
export type ProjectFormData = z.infer<typeof projectSchema>;

// Enhanced project type with relationships and strongly typed JSON fields
export interface ProjectWithRelations extends Omit<DbProject, 'tax_info' | 'accounting_info' | 'payroll_info' | 'service_info'> {
  tax_info: TaxInfo | null
  accounting_info: AccountingInfo | null
  payroll_info: PayrollInfo | null
  service_info: ServiceInfo | null
  client?: Database['public']['Tables']['clients']['Row'] | null
  template?: Database['public']['Tables']['project_templates']['Row'] | null
  tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_members?: Database['public']['Tables']['project_team_members']['Row'][]
  primary_manager_details?: Database['public']['Tables']['users']['Row'] | null
}

// Type guards
export function isTaxInfo(value: unknown): value is TaxInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('tax_year' in value) || typeof value.tax_year === 'number') &&
    (!('estimated_refund' in value) || typeof value.estimated_refund === 'number') &&
    (!('estimated_liability' in value) || typeof value.estimated_liability === 'number')
}

export function isAccountingInfo(value: unknown): value is AccountingInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('chart_of_accounts_setup' in value) || typeof value.chart_of_accounts_setup === 'boolean') &&
    (!('accounting_method' in value) || ['cash', 'accrual'].includes(value.accounting_method as string))
}

export function isPayrollInfo(value: unknown): value is PayrollInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('employee_count' in value) || typeof value.employee_count === 'number') &&
    (!('payroll_schedule' in value) || ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'].includes(value.payroll_schedule as string))
}

export function isServiceInfo(value: unknown): value is ServiceInfo {
  return value !== null &&
    typeof value === 'object' &&
    (!('frequency' in value) || ['one-time', 'weekly', 'monthly', 'quarterly', 'annually'].includes(value.frequency as string))
}

export function isDbProject(project: unknown): project is DbProject {
  return project !== null &&
    typeof project === 'object' &&
    'id' in project &&
    'name' in project &&
    'status' in project
}

// Conversion utilities
export function toProjectFormData(project: DbProject): Omit<ProjectFormData, 'service_type' | 'priority'> & {
  service_type?: ServiceType | null
  priority?: TaskPriority | null
} {
  const {
    id,
    created_at,
    updated_at,
    priority,
    service_type,
    ...formData
  } = project
  
  return {
    ...formData,
    priority: priority as TaskPriority,
    service_type: service_type as ServiceType,
    tax_info: isTaxInfo(project.tax_info) ? project.tax_info : null,
    accounting_info: isAccountingInfo(project.accounting_info) ? project.accounting_info : null,
    payroll_info: isPayrollInfo(project.payroll_info) ? project.payroll_info : null,
    service_info: isServiceInfo(project.service_info) ? project.service_info : null,
  }
}

export function toDbProject(formData: ProjectFormData): DbProjectInsert {
  const {
    tax_info,
    accounting_info,
    payroll_info,
    service_info,
    ...rest
  } = formData

  return {
    ...rest,
    name: rest.name || '',
    status: rest.status || 'not_started',
    tax_info: tax_info as Json,
    accounting_info: accounting_info as Json,
    payroll_info: payroll_info as Json,
    service_info: service_info as Json,
  }
}

// Constants
export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const satisfies Record<string, ProjectStatus>

export const SERVICE_TYPE = {
  TAX_RETURN: 'tax_return',
  BOOKKEEPING: 'bookkeeping',
  PAYROLL: 'payroll',
  ADVISORY: 'advisory',
} as const satisfies Record<string, ServiceType>

// Helper functions for type checking
export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(status as ProjectStatus)
}

export function isValidServiceType(type: string): type is ServiceType {
  return Object.values(SERVICE_TYPE).includes(type as ServiceType)
}

```

### `src\types\tasks.ts`

```typescript
import { z } from 'zod'
import type { Database } from './database.types'

export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).nullable(),
  project_id: z.string().nullable(),
  assignee_id: z.string().nullable(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  tax_form_type: z.string().nullable(),
  category: z.string().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>

export type TaskWithRelations = Database['public']['Tables']['tasks']['Row'] & {
  project: Database['public']['Tables']['projects']['Row'] | null
  assignee: Database['public']['Tables']['users']['Row'] | null
}

```

### `src\types\templates.ts`

```typescript
import type { Database } from './database.types'
import { z } from 'zod'
import { projectTemplateSchema, templateTaskSchema } from '@/lib/validations/template'

// Database types
export type DbProjectTemplate = Database['public']['Tables']['project_templates']['Row']
export type DbProjectTemplateInsert = Database['public']['Tables']['project_templates']['Insert']
export type DbProjectTemplateUpdate = Database['public']['Tables']['project_templates']['Update']

export type DbTemplateTask = Database['public']['Tables']['template_tasks']['Row']
export type DbTemplateTaskInsert = Database['public']['Tables']['template_tasks']['Insert']
export type DbTemplateTaskUpdate = Database['public']['Tables']['template_tasks']['Update']

// JSON field types from database
export type ProjectDefaults = NonNullable<DbProjectTemplate['project_defaults']>
export type SeasonalPriority = NonNullable<DbProjectTemplate['seasonal_priority']>

// Form data types
export type ProjectTemplateFormData = z.infer<typeof projectTemplateSchema>
export type TemplateTaskFormData = z.infer<typeof templateTaskSchema>

// Types with relationships
export interface ProjectTemplateWithRelations extends DbProjectTemplate {
  tasks?: DbTemplateTask[]
  category?: Database['public']['Tables']['template_categories']['Row'] | null
}

export interface TemplateTaskWithRelations extends DbTemplateTask {
  template?: DbProjectTemplate | null
  dependencies?: DbTemplateTask[]
}

// Template category types
export type DbTemplateCategory = Database['public']['Tables']['template_categories']['Row']
export type DbTemplateCategoryInsert = Database['public']['Tables']['template_categories']['Insert']
export type DbTemplateCategoryUpdate = Database['public']['Tables']['template_categories']['Update']

export interface TemplateCategoryWithRelations extends DbTemplateCategory {
  templates?: DbProjectTemplate[]
  parent?: DbTemplateCategory | null
  children?: DbTemplateCategory[]
} 
```

### `src\types\time_entries.ts`

```typescript
export type TimeEntry = {
  id?: string
  project_id?: string
  task_id?: string
  user_id?: string
  start_time: string
  end_time?: string
  duration?: number
  description?: string
  billable?: boolean
  hourly_rate?: number
  tags?: string[]
} 
```

### `src\types\users.ts`

```typescript
import type { Database } from './database.types'
import { z } from 'zod'
import { userSchema, profileSchema } from '@/lib/validations/user'

// Database types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbUserInsert = Database['public']['Tables']['users']['Insert']
export type DbUserUpdate = Database['public']['Tables']['users']['Update']

export type DbProfile = Database['public']['Tables']['profiles']['Row']
export type DbProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type DbProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Enum types from database
export type UserRole = Database['public']['Enums']['user_role']

// Form data types
export type UserFormData = z.infer<typeof userSchema>
export type ProfileFormData = z.infer<typeof profileSchema>

// Types with relationships
export interface UserWithRelations extends DbUser {
  profile?: DbProfile | null
  managed_projects?: Database['public']['Tables']['projects']['Row'][]
  assigned_tasks?: Database['public']['Tables']['tasks']['Row'][]
  team_memberships?: Database['public']['Tables']['project_team_members']['Row'][]
}

export interface ProfileWithRelations extends DbProfile {
  user?: DbUser | null
}

// Constants
export const USER_ROLES: UserRole[] = [
  'admin',
  'team_member'
] 
```

### `src\types\validation.ts`

```typescript
import { z } from 'zod'
import type { Database } from './database.types'

type DbEnums = Database['public']['Enums']

// Contact Info Schema
export const contactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
})

// Client Schema
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  contact_info: contactInfoSchema,
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['client_status'][]),
  type: z.enum(['business', 'individual'] as const satisfies readonly DbEnums['client_type'][]).optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Project Schema
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_id: z.string().uuid(),
  status: z.enum([
    'not_started',
    'on_hold',
    'cancelled',
    'todo',
    'in_progress',
    'review',
    'blocked',
    'completed',
    'archived'
  ] as const satisfies readonly DbEnums['project_status'][]),
  service_type: z.enum([
    'tax_return',
    'bookkeeping',
    'payroll',
    'advisory'
  ] as const satisfies readonly DbEnums['service_type'][]).optional(),
  start_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Schema
export const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum([
    'todo',
    'in_progress',
    'review',
    'completed'
  ] as const satisfies readonly DbEnums['task_status'][]),
  priority: z.enum([
    'low',
    'medium',
    'high',
    'urgent'
  ] as const satisfies readonly DbEnums['task_priority'][]),
  project_id: z.string().uuid().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ['in_progress', 'review'],
  in_progress: ['todo', 'review', 'completed'],
  review: ['in_progress', 'completed'],
  completed: ['review']
} as const

// Utility type for valid status transitions
export type ValidStatusTransition<T extends DbEnums['task_status']> = typeof taskStatusTransitions[T][number]

// Form Data Schemas
export const clientFormSchema = clientSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const projectFormSchema = projectSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const taskFormSchema = taskSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

// Type Inference
export type ClientFormData = z.infer<typeof clientFormSchema>
export type ProjectFormData = z.infer<typeof projectFormSchema>
export type TaskFormData = z.infer<typeof taskFormSchema>

// Validation Functions
export const validateClient = (data: unknown) => clientSchema.parse(data)
export const validateProject = (data: unknown) => projectSchema.parse(data)
export const validateTask = (data: unknown) => taskSchema.parse(data)

// Safe Status Transition Validator
export const validateTaskStatusTransition = (
  currentStatus: DbEnums['task_status'],
  newStatus: DbEnums['task_status']
): boolean => {
  const allowedTransitions = taskStatusTransitions[currentStatus]
  return allowedTransitions.includes(newStatus as any)
} 
```

### `src\types\workflows.ts`

```typescript
import { Database } from './database.types'

// Base types from database
export type DbWorkflowTemplate = Database['public']['Tables']['workflow_templates']['Row']
export type DbWorkflowTemplateInsert = Database['public']['Tables']['workflow_templates']['Insert']
export type DbWorkflowTemplateUpdate = Database['public']['Tables']['workflow_templates']['Update']

// Workflow status enum
export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
} as const

export type WorkflowStatus = typeof WORKFLOW_STATUS[keyof typeof WORKFLOW_STATUS]

// Step type for workflow templates
export interface WorkflowStep {
  id: string
  title: string
  description?: string | null
  order: number
  required: boolean
  dependencies?: string[] | null
  metadata?: Record<string, unknown> | null
}

// Extended type with relationships
export interface WorkflowTemplateWithRelations extends DbWorkflowTemplate {
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][] | null
}

// Form data types
export type WorkflowFormData = Omit<DbWorkflowTemplateInsert, 'id' | 'created_at' | 'updated_at'> 
```

### `src\components\tasks\progress-tracker.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Clock, Minus, Plus } from 'lucide-react'

interface ProgressTrackerProps {
  progress: number
  estimatedHours?: number
  actualHours?: number
  onProgressChange?: (value: number) => void
  onActualHoursChange?: (hours: number) => void
  showTimeTracking?: boolean
  readOnly?: boolean
}

export function ProgressTracker({
  progress,
  estimatedHours,
  actualHours,
  onProgressChange,
  onActualHoursChange,
  showTimeTracking = false,
  readOnly = false
}: ProgressTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null)

  const handleTrackingToggle = () => {
    if (isTracking) {
      // Stop tracking
      if (trackingStartTime && onActualHoursChange) {
        const elapsedHours = (new Date().getTime() - trackingStartTime.getTime()) / (1000 * 60 * 60)
        onActualHoursChange((actualHours || 0) + elapsedHours)
      }
      setIsTracking(false)
      setTrackingStartTime(null)
    } else {
      // Start tracking
      setIsTracking(true)
      setTrackingStartTime(new Date())
    }
  }

  const adjustActualHours = (increment: boolean) => {
    if (!onActualHoursChange) return
    const change = increment ? 0.5 : -0.5
    const newHours = Math.max(0, (actualHours || 0) + change)
    onActualHoursChange(newHours)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {readOnly ? (
            <Progress value={progress} className="h-2" />
          ) : (
            <Slider
              value={[progress]}
              onValueChange={([value]) => onProgressChange?.(value)}
              max={100}
              step={5}
              className="h-2"
            />
          )}
        </div>
        <div className="w-12 text-sm text-muted-foreground">
          {progress}%
        </div>
      </div>

      {showTimeTracking && (
        <div className="flex items-center gap-2 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {actualHours?.toFixed(1) || 0}/{estimatedHours || 0}h
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Actual / Estimated Hours</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!readOnly && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustActualHours(false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustActualHours(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant={isTracking ? "destructive" : "secondary"}
                size="sm"
                onClick={handleTrackingToggle}
              >
                {isTracking ? "Stop" : "Start"} Timer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### `src\components\tasks\project-tasks.tsx`

```typescript
import { useState } from 'react'
import { TaskDialog } from './task-dialog'
import { TaskCard } from './task-card'
import { TaskFormData, TaskWithRelations, toDbTaskInsert } from '@/types/tasks'

interface ProjectTasksProps {
  project: {
    id: string
    name: string
  }
  tasks: TaskWithRelations[]
  onTaskCreate: (task: TaskFormData) => Promise<void>
  onTaskUpdate: (taskId: string, task: TaskFormData) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
}

export function ProjectTasks({
  project,
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null)

  const handleCreateTask = async (data: TaskFormData) => {
    await onTaskCreate(data)
    setDialogOpen(false)
  }

  const handleEditTask = async (data: TaskFormData) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, data)
      setEditingTask(null)
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setDialogOpen(true)}>Add Task</button>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => setEditingTask(task)}
            onDelete={onTaskDelete}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        initialData={{
          project_id: project.id,
          status: 'todo',
          priority: 'medium'
        }}
      />

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          initialData={editingTask}
        />
      )}
    </div>
  )
} 
```

### `src\components\tasks\task-card.tsx`

```typescript
'use client';

import { TaskWithRelations } from '@/types/tasks'

interface TaskCardProps {
  task: TaskWithRelations
  onEdit: (task: TaskWithRelations) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium">{task.title}</h3>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{task.status}</span>
          {task.priority && <span className="text-sm text-gray-500">{task.priority}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

```

### `src\components\tasks\task-container.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { TaskErrorBoundary } from './task-error-boundary'
import { TaskDialog } from './task-dialog'
import { useTasks } from '@/hooks/useTasks'
import type { TaskFormData } from '@/types/tasks'

interface TaskContainerProps {
  projectId?: string
}

export function TaskContainer({ projectId }: TaskContainerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Partial<TaskFormData> | undefined>()
  
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
  } = useTasks({ projectId })

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleSubmit = async (data: TaskFormData) => {
    if (selectedTask?.id) {
      await updateTask(selectedTask.id, data)
    } else {
      await createTask(data)
    }
    setSelectedTask(undefined)
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <TaskErrorBoundary>
      <div>
        {/* Task list rendering would go here */}
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialData={selectedTask}
          onSubmit={handleSubmit}
        />
      </div>
    </TaskErrorBoundary>
  )
} 
```

### `src\components\tasks\task-dialog.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { taskSchema, type TaskFormData, type TaskWithRelations, type TaskStatus, type TaskPriority } from '@/types/tasks'

interface TaskDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  taskData?: TaskWithRelations | null
  onSubmit: (data: TaskFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TaskDialog({ 
  isOpen, 
  setIsOpen, 
  taskData, 
  onSubmit,
  isSubmitting 
}: TaskDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskData?.title || '',
      description: taskData?.description || '',
      status: (taskData?.status as TaskStatus) || 'todo',
      priority: (taskData?.priority as TaskPriority | null) || null,
      project_id: taskData?.project_id || null,
      assignee_id: taskData?.assignee_id || null,
      due_date: taskData?.due_date || null,
      start_date: taskData?.start_date || null,
      tax_form_type: taskData?.tax_form_type || null,
      category: taskData?.category || null,
    }
  })

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskData ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
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
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : taskData ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### `src\components\tasks\task-error-boundary.tsx`

```typescript
'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class TaskErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An error occurred while loading tasks'}
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Try again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
} 
```

### `src\components\tasks\task-form.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskFormData, taskSchema, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'

interface TaskFormProps {
  initialData?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TaskForm({ initialData, onSubmit, isSubmitting }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'todo',
      priority: initialData?.priority || 'medium',
      project_id: initialData?.project_id || null,
      assignee_id: initialData?.assignee_id || null,
      due_date: initialData?.due_date || null,
      start_date: initialData?.start_date || null,
      tax_form_type: initialData?.tax_form_type || null,
      category: initialData?.category || null,
    },
  })

  const handleSubmit = async (values: TaskFormData) => {
    try {
      await onSubmit(values)
      form.reset()
    } catch (error) {
      // Error will be handled by the parent component
      form.setError('root', { 
        message: error instanceof Error ? error.message : 'Failed to submit task'
      })
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
                <Input {...field} placeholder="Task title" />
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
                <Textarea {...field} placeholder="Task description" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskPriorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString())}
                  />
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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
```

### `src\components\tasks\task-item.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import { TaskWithRelations, TaskFormData } from '@/types/tasks';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: TaskWithRelations;
  onUpdate: (taskId: string, data: TaskFormData) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdate = async (data: TaskFormData) => {
    await onUpdate(task.id, data);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-500">{task.description}</p>
            )}
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">{task.status}</Badge>
              {task.priority && <Badge variant="outline">{task.priority}</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={task}
        onSubmit={handleUpdate}
      />
    </>
  );
} 
```

### `src\components\tasks\task-list.tsx`

```typescript
'use client'

import { useState } from 'react'
import { TaskDialog } from './task-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskFormData, TaskWithRelations, toTaskFormData } from '@/types/tasks'

interface TaskListProps {
  tasks: TaskWithRelations[]
  isLoading?: boolean
  onUpdate?: (taskId: string, data: TaskFormData) => Promise<void>
  onDelete?: (taskId: string) => Promise<void>
  onCreate?: (data: TaskFormData) => Promise<void>
}

export function TaskList({
  tasks,
  isLoading = false,
  onUpdate,
  onDelete,
  onCreate
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleOpenDialog = (task?: TaskWithRelations) => {
    setSelectedTask(task || null)
    setIsCreating(!task)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (isCreating && onCreate) {
        await onCreate(data)
      } else if (selectedTask?.id && onUpdate) {
        await onUpdate(selectedTask.id, data)
      }
      setDialogOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Failed to submit task:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Button disabled>Create Task</Button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button onClick={() => handleOpenDialog()}>Create Task</Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    {task.priority && (
                      <Badge variant="outline">{task.priority}</Badge>
                    )}
                    {task.project && (
                      <Badge variant="outline">{task.project.name}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onUpdate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(task)}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedTask ? toTaskFormData(selectedTask) : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
```

### `src\components\tasks\task-side-panel.tsx`

```typescript
'use client'

import { useState } from 'react'
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
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import type { Json } from '@/types/database.types'
import { 
  TaskWithRelations,
  TaskStatus,
  TaskPriority,
  taskStatusOptions, 
  taskPriorityOptions
} from '@/types/tasks'
import { Database } from '@/types/database.types'
import { taskSchema } from '@/lib/validations/task'
import type { TaskFormSchema } from '@/lib/validations/task'

type ActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Insert']

type TaskWithRelationsResponse = Database['public']['Tables']['tasks']['Row'] & {
  assignee: {
    id: string
    email: string
    full_name: string
    role: Database['public']['Enums']['user_role']
  } | null
  project: {
    id: string
    name: string
  } | null
  parent_task: {
    id: string
    title: string
  } | null
  activity_log_entries: Database['public']['Tables']['activity_log_entries']['Row'][]
}

type DbTask = Database['public']['Tables']['tasks']['Row']
type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

type FormData = TaskFormSchema

interface TaskSidePanelProps {
  isOpen: boolean
  onClose: () => void
  task: TaskWithRelations | null
  projectId?: string
  onTaskUpdate?: (task: TaskWithRelations) => void
}

export function TaskSidePanel({ 
  isOpen, 
  onClose, 
  task, 
  projectId,
  onTaskUpdate
}: TaskSidePanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  
  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      project_id: task.project_id,
      assignee_id: task.assignee_id || undefined,
      status: task.status as TaskStatus || 'todo',
      priority: task.priority as TaskPriority || 'medium',
      due_date: task.due_date || null,
      start_date: task.start_date || null,
      checklist: {
        items: task.checklist_items?.map(item => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
          description: item.description || null,
          task_id: item.task_id
        })) || null,
        completed_count: task.checklist_items?.filter(item => item.completed).length || 0,
        total_count: task.checklist_items?.length || 0
      },
      activity_log: task.activity_log_entries?.map(entry => ({
        action: entry.action,
        timestamp: entry.created_at || '',
        user_id: entry.performed_by,
        details: entry.details?.toString() || ''
      })) || null,
      recurring_config: task.recurring_config
    } : {
      title: '',
      description: '',
      project_id: '', // This should be provided by the parent component
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      due_date: null,
      start_date: null,
      checklist: null,
      activity_log: null,
      recurring_config: null
    }
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
        start_date: data.start_date,
        recurring_config: data.recurring_config,
        updated_at: new Date().toISOString()
      } satisfies DbTaskUpdate

      if (task?.id) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id)
        
        if (error) throw error

        // Update checklist items
        if (data.checklist?.items) {
          const checklistItems = data.checklist.items.map(item => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: task.id,
            updated_at: new Date().toISOString()
          })) satisfies Database['public']['Tables']['checklist_items']['Insert'][]

          const { error: checklistError } = await supabase
            .from('checklist_items')
            .upsert(checklistItems)
          
          if (checklistError) throw checklistError
        }

        // Add activity log entry
        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert({
            task_id: task.id,
            action: 'updated',
            details: taskData,
            created_at: new Date().toISOString()
          })
        
        if (activityError) throw activityError
      } else {
        const insertData = {
          ...taskData,
          title: data.title, // Explicitly include required fields
          created_at: new Date().toISOString()
        } satisfies DbTaskInsert

        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([insertData])
          .select()
          .single()
        
        if (error) throw error

        // Create checklist items
        if (data.checklist?.items && newTask) {
          const checklistItems = data.checklist.items.map(item => ({
            title: item.title,
            completed: item.completed,
            description: item.description,
            task_id: newTask.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) satisfies Database['public']['Tables']['checklist_items']['Insert'][]

          const { error: checklistError } = await supabase
            .from('checklist_items')
            .insert(checklistItems)
          
          if (checklistError) throw checklistError
        }

        // Add initial activity log entry
        if (newTask) {
          const { error: activityError } = await supabase
            .from('activity_log_entries')
            .insert({
              task_id: newTask.id,
              action: 'created',
              details: { status: newTask.status },
              created_at: new Date().toISOString()
            })
          
          if (activityError) throw activityError
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
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

        <div className="space-y-4 mt-4">
          <Form form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormLabel id="status-label">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger aria-labelledby="status-label">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                    <FormLabel id="priority-label">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger aria-labelledby="priority-label">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskPriorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : task ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### `src\components\projects\create-project-dialog.tsx`

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations/project';
import { useToast } from '@/components/ui/use-toast';
import { ProjectFormData } from '@/types/projects';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      service_type: null,
      status: 'not_started',
      template_tasks: [],
    },
  });

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
      toast({ title: 'Success', description: 'Project created successfully' });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Enter the details for your new project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Input placeholder="Enter project description" {...field} />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tax_return">Tax Return</SelectItem>
                    <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Project'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

```

### `src\components\projects\new-project-button.tsx`

```typescript
'use client';

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { PlusCircle } from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";
import { useProjects } from '@/hooks/useProjects';
import { ProjectFormData } from '@/lib/validations/project';

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const { fetchProjects, createProject } = useProjects();

  const handleSubmit = async (data: ProjectFormData) => {
    await createProject(data);
    await fetchProjects();
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        New Project
      </Button>
      
      <CreateProjectDialog 
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### `src\components\projects\project-card.tsx`

```typescript
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, isAfter, subDays } from "date-fns";
import { CreateProjectDialog } from "./create-project-dialog";
import {
  Building2,
  Clock,
  FileText,
  MoreHorizontal,
  Users2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database.types";
import { ProjectFormData } from "@/types/projects";
import { useToast } from "@/components/ui/use-toast";

type DbProject = Database['public']['Views']['project_dashboard']['Row'];

interface ProjectCardProps {
  project: DbProject;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const isOverdue = project.due_date
    ? isAfter(new Date(), new Date(project.due_date))
    : false;
  const isDueSoon = project.due_date
    ? isAfter(new Date(project.due_date), new Date()) &&
      isAfter(new Date(project.due_date), subDays(new Date(), 7))
    : false;

  const handleUpdateProject = async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: data.name,
          service_type: data.service_type,
          status: data.status,
        })
        .eq('id', project.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">{project.name}</h3>
          <p className="text-sm text-muted-foreground">
            {project.service_type?.replace("_", " ") || "No service type"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Edit
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(project.id)}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.client_name || "No client assigned"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">
              {project.service_type?.replace("_", " ") || "No service type"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.assigned_team_members || "No team members"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.due_date
                ? formatDistanceToNow(new Date(project.due_date), {
                    addSuffix: true,
                  })
                : "No due date"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            project.status === "completed" && "border-green-500 text-green-500",
            project.status === "in_progress" && "border-blue-500 text-blue-500",
            project.status === "blocked" && "border-red-500 text-red-500"
          )}
        >
          {project.status?.replace("_", " ")}
        </Badge>
        {(isOverdue || isDueSoon) && (
          <Badge
            variant="outline"
            className={cn(
              isOverdue && "border-red-500 text-red-500",
              isDueSoon && "border-yellow-500 text-yellow-500"
            )}
          >
            {isOverdue ? "Overdue" : "Due Soon"}
          </Badge>
        )}
      </CardFooter>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleUpdateProject}
      />
    </Card>
  );
}

ProjectCard.Skeleton = function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-5 w-[100px]" />
      </CardFooter>
    </Card>
  );
};

```

### `src\components\projects\project-details.tsx`

```typescript
'use client'

import type { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Phone, Building, FileText } from "lucide-react"
import Link from "next/link"

type DbProject = Database['public']['Views']['project_dashboard']['Row']

interface ProjectDetailsProps {
  project: DbProject
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  if (!project) return <div>No project data available</div>

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Details about the client associated with this project</CardDescription>
        </CardHeader>
        <CardContent>
          {project.client_name ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{project.client_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.client_name}</div>
                  {project.company_name && (
                    <div className="text-sm text-muted-foreground">{project.company_name}</div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${project.id}`}>
                    View Client Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No client associated with this project
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Important dates and project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Due: {project.due_date ? format(new Date(project.due_date), 'MMMM d, yyyy') : 'No due date'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>Service Type: {project.service_type?.replace("_", " ") || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Overview of task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(project.completion_percentage || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {project.total_tasks || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Task Status</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{project.completed_tasks || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {project.assigned_team_members ? (
              <span className="text-sm">{project.assigned_team_members}</span>
            ) : (
              <span className="text-sm text-muted-foreground">No team members assigned</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### `src\components\projects\project-filters-wrapper.tsx`

```typescript
'use client';

import { useState } from "react";
import { ProjectFilters as ProjectFiltersComponent } from "@/components/projects/project-filters";
import { ProjectFilters } from "@/hooks/useProjectFilters";

interface ProjectFiltersWrapperProps {
  clientOptions: Array<{ id: string; label: string }>;
}

export function ProjectFiltersWrapper({ clientOptions }: ProjectFiltersWrapperProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: [],
    priority: [],
    service_category: [],
    clientId: "all",
    dateRange: undefined,
    sortBy: "due_date",
    sortOrder: "asc",
    groupBy: "status"
  });

  return (
    <ProjectFiltersComponent
      filters={filters}
      onChange={setFilters}
      clientOptions={clientOptions}
    />
  );
}

```

### `src\components\projects\project-filters.tsx`

```typescript
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import type { Priority, ServiceCategory, ProjectStatus } from "@/types/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  Search, 
  X,
  ArrowUpDown,
} from "lucide-react";
import type { ProjectFilters as ProjectFiltersType } from "@/hooks/useProjectFilters";
import { defaultFilters } from "@/hooks/useProjectFilters";
import { Badge } from "@/components/ui/badge";
import { ClientCombobox } from "@/components/clients/client-combobox";

interface ProjectFiltersProps {
  filters: ProjectFiltersType;
  onChange: (filters: ProjectFiltersType) => void;
  clientOptions?: Array<{ id: string; label: string }>;
}

export function ProjectFilters({ filters, onChange, clientOptions = [] }: ProjectFiltersProps) {
  const [date, setDate] = useState<DateRange | undefined>(filters.dateRange);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange({
      ...filters,
      dateRange: range,
    });
  };

  const clearFilters = () => {
    setDate(undefined);
    onChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.search !== "" || 
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.service_category.length > 0 ||
    filters.clientId !== "all" ||
    filters.dateRange !== undefined;

  const toggleSortOrder = () => {
    onChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, clients..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => onChange({ ...filters, search: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Main Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <Select
            value={filters.status.length > 0 ? filters.status[0] : "all"}
            onValueChange={(value) => onChange({ 
              ...filters, 
              status: value === "all" ? [] : [value as ProjectStatus] 
            })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority.length > 0 ? filters.priority[0] : "all"}
            onValueChange={(value) => onChange({ 
              ...filters, 
              priority: value === "all" ? [] : [value as Priority] 
            })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          {/* Stage Filter */}
          <Select
            value={filters.service_category.length > 0 ? filters.service_category[0] : "all"}
            onValueChange={(value) => onChange({ 
              ...filters, 
              service_category: value === "all" ? [] : [value as ServiceCategory] 
            })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="tax_returns">Tax Returns</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="accounting">Accounting</SelectItem>
              <SelectItem value="tax_planning">Tax Planning</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Filter */}
          {clientOptions.length > 0 && (
            <div className="w-[180px]">
              <ClientCombobox
                value={filters.clientId === 'all' ? null : filters.clientId}
                onChange={(value) => onChange({ ...filters, clientId: value || 'all' })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Secondary Row - Date and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Sort Options */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time</SelectLabel>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="due">Due Date</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Properties</SelectLabel>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="estimatedHours">Estimated Hours</SelectItem>
                <SelectItem value="completedTasks">Completion</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Sort Direction Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className={cn(
              "h-10 w-10",
              filters.sortOrder === 'desc' && "bg-muted"
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
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
type TaskPriority = Database['public']['Enums']['task_priority'];
type ServiceType = Database['public']['Enums']['service_type'];

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
      service_type: project.service_type as ServiceType | null,
      status: project.status,
      priority: project.priority as TaskPriority | undefined,
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
      task_count: project.task_count
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

### `src\components\projects\project-group.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectGroupProps {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ProjectGroup({ 
  title, 
  count, 
  children, 
  defaultExpanded = true 
}: ProjectGroupProps) {
  // Initialize state with defaultExpanded prop
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6 hover:bg-secondary/80"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isExpanded ? 'Collapse' : 'Expand'} {title}
          </span>
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">({count})</span>
        </div>
      </div>
      <div
        className={cn(
          "grid transition-all duration-200",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className={cn(
          "overflow-hidden",
          isExpanded ? "visible" : "invisible"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}

```

### `src\components\projects\project-header.tsx`

```typescript
'use client'

import { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Mail } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectFormData } from "@/types/projects"

type DbProject = Database['public']['Tables']['projects']['Row']
type DbClient = Database['public']['Tables']['clients']['Row']

interface ProjectHeaderProps {
  project: DbProject & {
    client?: DbClient | null
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant={
              project.status === 'completed' ? 'default' :
              project.status === 'in_progress' ? 'secondary' :
              'outline'
            }>
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 text-muted-foreground">
              {project.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {project.client && (
              <Link href={`/clients/${project.client.id}`} className="flex items-center gap-1 hover:text-foreground">
                {project.client.company_name || project.client.full_name}
              </Link>
            )}
            {project.start_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Started {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            {project.due_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Due {format(new Date(project.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {project.client?.contact_email && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`mailto:${project.client.contact_email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email Client
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Project
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-b py-4">
        <div>
          <div className="text-sm font-medium">Status</div>
          <Badge className="mt-1" variant={
            project.status === 'completed' ? 'default' :
            project.status === 'in_progress' ? 'secondary' :
            'outline'
          }>
            {project.status}
          </Badge>
        </div>
        <div>
          <div className="text-sm font-medium">Priority</div>
          <Badge className="mt-1" variant={
            project.priority === 'high' ? 'destructive' :
            project.priority === 'medium' ? 'default' :
            'secondary'
          }>
            {project.priority}
          </Badge>
        </div>
        <div>
          <div className="text-sm font-medium">Progress</div>
          <div className="mt-1 text-2xl font-bold">
            {Math.round(project.completion_percentage || 0)}%
          </div>
        </div>
      </div>

      <CreateProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={async (data: ProjectFormData) => {
          // Handle project update
          console.log('Update project:', data)
        }}
      />
    </div>
  )
}
```

### `src\components\projects\project-list.tsx`

```typescript
'use client';

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database.types';

interface ProjectListProps {
	clientId?: string;
}

export default function ProjectList({ clientId }: ProjectListProps) {
	const [projects, setProjects] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const supabase = createClientComponentClient<Database>();

	React.useEffect(() => {
		async function fetchProjects() {
			try {
				let query = supabase
					.from('projects')
					.select('*')
					.order('created_at', { ascending: false });

				if (clientId) {
					query = query.eq('client_id', clientId);
				}

				const { data } = await query;
				setProjects(data || []);
			} catch {
				console.error('Error fetching projects');
			} finally {
				setLoading(false);
			}
		}

		fetchProjects();
	}, [clientId, supabase]);

	if (loading) {
		return <div>Loading projects...</div>;
	}

	if (projects.length === 0) {
		return <div>No projects found</div>;
	}

	return (
		<div className="space-y-4">
			{projects.map((project) => (
				<div key={project.id} className="p-4 border rounded-lg">
					<h3 className="font-semibold">{project.name}</h3>
					{project.description && (
						<p className="text-sm text-muted-foreground">{project.description}</p>
					)}
					<div className="mt-2 flex items-center gap-4 text-sm">
						<span>
							<span className="font-medium">Status:</span> {project.status}
						</span>
						{project.created_at && (
							<span className="text-muted-foreground">
								Created {formatDistanceToNow(new Date(project.created_at))} ago
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}


```

### `src\components\projects\project-tasks.tsx`

```typescript
'use client'

import { ProjectWithRelations } from "@/types/projects"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskList } from "@/components/tasks/task-list"
import { useTasks } from "@/hooks/useTasks"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Database } from "@/types/database.types"
import { TaskWithRelations } from "@/types/tasks"

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']

interface ProjectTasksProps {
  project: ProjectWithRelations
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { tasks, isLoading, error, mutate } = useTasks(project.id)

  const handleCreateTask = async (data: DbTaskInsert) => {
    // Handle task creation
    console.log('Create task:', data)
    setDialogOpen(false)
  }

  const handleUpdateTask = async (task: DbTaskInsert, taskId: string) => {
    // Handle task update
    console.log('Update task:', task)
    await mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {error ? (
        <div className="text-red-500">Error loading tasks: {error.message}</div>
      ) : (
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onUpdate={handleUpdateTask}
        />
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        initialData={{
          project_id: project.id,
          status: 'todo',
          priority: 'medium'
        }}
      />
    </div>
  )
}
```

### `src\components\projects\form\BasicInfoSection.tsx`

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProjectFormContext } from './ProjectFormContext';
import { ClientSelect } from '@/components/clients/client-select';
import { PrioritySelect } from '@/components/shared/priority-select';
import { useClients } from '@/hooks/useClients';

export function BasicInfoSection() {
  const { form } = useProjectFormContext();
  const { data: clients = [] } = useClients();

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id={field.name}
                placeholder="Enter project name"
                {...field}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id={field.name}
                placeholder="Enter project description"
                {...field}
                value={field.value || ''}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">
                Client
              </label>
              <ClientSelect
                value={field.value}
                onSelect={field.onChange}
                clients={clients}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Priority
              </label>
              <PrioritySelect
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
} 
```

### `src\components\projects\form\ProjectForm.tsx`

```typescript
'use client';

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProjectFormProvider } from './ProjectFormContext'
import { BasicInfoSection } from './BasicInfoSection'
import { TaskSection } from './TaskSection'
import { projectSchema } from '@/lib/validations/project'
import type { ProjectFormData, ProjectWithRelations, ServiceType } from '@/types/projects'

interface ProjectFormProps {
  initialData?: Partial<ProjectWithRelations>
  onSubmit: (data: ProjectFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ProjectForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: initialData?.status || 'not_started',
      service_type: (initialData?.service_type as ServiceType) || 'tax_return',
      priority: initialData?.priority || 'medium',
      start_date: initialData?.start_date || null,
      due_date: initialData?.due_date || null,
      client_id: initialData?.client_id || null,
    },
  })

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Failed to submit project',
      })
    }
  }

  return (
    <ProjectFormProvider form={form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <BasicInfoSection />
            </TabsContent>
            <TabsContent value="tasks">
              <TaskSection projectId={initialData?.id ?? ''} />
            </TabsContent>
          </Tabs>

          {form.formState.errors.root && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </Form>
    </ProjectFormProvider>
  )
} 
```

### `src\components\projects\form\ProjectFormContext.tsx`

```typescript
'use client';

import { createContext, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormData } from '@/types/projects';

interface ProjectFormContextType {
  form: UseFormReturn<ProjectFormData>;
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(
  undefined
);

export function ProjectFormProvider({
  children,
  form,
}: {
  children: React.ReactNode;
  form: UseFormReturn<ProjectFormData>;
}) {
  return (
    <ProjectFormContext.Provider value={{ form }}>
      {children}
    </ProjectFormContext.Provider>
  );
}

export function useProjectFormContext() {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error(
      'useProjectFormContext must be used within a ProjectFormProvider'
    );
  }
  return context;
} 
```

### `src\components\projects\form\ProjectFormHeader.tsx`

```typescript
'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectFormHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
}

export function ProjectFormHeader({ isEditing, isSubmitting }: ProjectFormHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h2>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-[150px]"
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isEditing ? 'Update Project' : 'Create Project'}
      </Button>
    </div>
  );
} 
```

### `src\components\projects\form\ProjectFormTabs.tsx`

```typescript
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BasicInfoSection } from './BasicInfoSection';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { TaskSection } from './TaskSection';
import { useProjectFormContext } from './ProjectFormContext';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

interface ProjectFormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  getTabProgress: (tab: string) => number;
}

export function ProjectFormTabs({ activeTab, onTabChange, getTabProgress }: ProjectFormTabsProps) {
  const { form } = useProjectFormContext();

  const handleAddTask = (task: DbTaskInsert) => {
    const tasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', [...tasks, task]);
  };

  const handleEditTask = (task: DbTaskInsert, taskId: string) => {
    const tasks = form.getValues('template_tasks') || [];
    const updatedTasks = tasks.map(t => t.id === taskId ? task : t);
    form.setValue('template_tasks', updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const tasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', tasks.filter(t => t.id !== taskId));
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="service">Service Details</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <Progress value={getTabProgress(activeTab)} className="w-full" />
      </div>

      <TabsContent value="basic" className="mt-4">
        <BasicInfoSection />
      </TabsContent>

      <TabsContent value="service" className="mt-4">
        <ServiceDetailsSection />
      </TabsContent>

      <TabsContent value="tasks" className="mt-4">
        <TaskSection
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </TabsContent>
    </Tabs>
  );
} 
```

### `src\components\projects\form\ServiceDetailsSection.tsx`

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useProjectFormContext } from './ProjectFormContext';
import { TaxInfoFields } from './service-fields/TaxInfoFields';
import { AccountingInfoFields } from './service-fields/AccountingInfoFields';
import { PayrollInfoFields } from './service-fields/PayrollInfoFields';
import { TaxInfo, AccountingInfo, PayrollInfo } from '@/types/projects';
import { ProjectFormValues } from '@/lib/validations/project';

export function ServiceDetailsSection() {
  const { form } = useProjectFormContext();
  const serviceType = form.watch('service_type');

  const renderServiceFields = () => {
    switch (serviceType) {
      case 'tax_return':
        return (
          <Card>
            <CardContent className="p-6">
              <TaxInfoFields
                value={(form.watch('tax_info') as ProjectFormValues['tax_info']) || {}}
                onChange={(value) => form.setValue('tax_info', value as ProjectFormValues['tax_info'])}
              />
            </CardContent>
          </Card>
        );
      case 'bookkeeping':
        return (
          <Card>
            <CardContent className="p-6">
              <AccountingInfoFields
                value={(form.watch('accounting_info') as ProjectFormValues['accounting_info']) || {}}
                onChange={(value) => form.setValue('accounting_info', value as ProjectFormValues['accounting_info'])}
              />
            </CardContent>
          </Card>
        );
      case 'payroll':
        return (
          <Card>
            <CardContent className="p-6">
              <PayrollInfoFields
                value={(form.watch('payroll_info') as ProjectFormValues['payroll_info']) || {}}
                onChange={(value) => form.setValue('payroll_info', value as ProjectFormValues['payroll_info'])}
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderServiceFields()}
    </div>
  );
} 
```

### `src\components\projects\form\TaskSection.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import { useTasks } from '@/hooks/useTasks';
import { toast } from '@/components/ui/use-toast';
import type { TaskFormData, TaskWithRelations } from '@/types/tasks';

interface TaskSectionProps {
  projectId: string;
}

export function TaskSection({ projectId }: TaskSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks({ projectId });

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, data: TaskFormData) => {
    try {
      await updateTask(taskId, data);
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  );
} 
```

### `src\components\projects\form\service-fields\AccountingInfoFields.tsx`

```typescript
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountingInfo } from '@/types/projects';

interface AccountingInfoFieldsProps {
  value: AccountingInfo;
  onChange: (value: AccountingInfo) => void;
}

export function AccountingInfoFields({ value, onChange }: AccountingInfoFieldsProps) {
  const handleChange = (field: keyof AccountingInfo, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Period Start</Label>
          <Input
            type="date"
            value={value.period_start || ''}
            onChange={(e) => handleChange('period_start', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Period End</Label>
          <Input
            type="date"
            value={value.period_end || ''}
            onChange={(e) => handleChange('period_end', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Accounting Method</Label>
        <Select
          value={value.accounting_method || ''}
          onValueChange={(newValue) => handleChange('accounting_method', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select accounting method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="accrual">Accrual</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fiscal Year End</Label>
        <Input
          type="date"
          value={value.fiscal_year_end || ''}
          onChange={(e) => handleChange('fiscal_year_end', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Last Reconciliation Date</Label>
        <Input
          type="date"
          value={value.last_reconciliation_date || ''}
          onChange={(e) => handleChange('last_reconciliation_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Software Used</Label>
        <Input
          value={value.software_used || ''}
          onChange={(e) => handleChange('software_used', e.target.value)}
          placeholder="e.g., QuickBooks Online"
        />
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={value.frequency || ''}
          onValueChange={(newValue) => handleChange('frequency', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          value={value.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
} 
```

### `src\components\projects\form\service-fields\PayrollInfoFields.tsx`

```typescript
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PayrollInfo } from '@/types/projects';

type PayrollSchedule = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface PayrollInfoFieldsProps {
  value: PayrollInfo;
  onChange: (value: PayrollInfo) => void;
}

export function PayrollInfoFields({ value, onChange }: PayrollInfoFieldsProps) {
  const handleChange = (field: keyof PayrollInfo, newValue: string | number) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Payroll Schedule</Label>
        <Select
          value={value.payroll_schedule || ''}
          onValueChange={(newValue) => handleChange('payroll_schedule', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payroll schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
            <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Employee Count</Label>
        <Input
          type="number"
          value={value.employee_count || ''}
          onChange={(e) => handleChange('employee_count', parseInt(e.target.value, 10))}
          placeholder="Number of employees"
        />
      </div>

      <div className="space-y-2">
        <Label>Last Payroll Date</Label>
        <Input
          type="date"
          value={value.last_payroll_date || ''}
          onChange={(e) => handleChange('last_payroll_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Next Payroll Date</Label>
        <Input
          type="date"
          value={value.next_payroll_date || ''}
          onChange={(e) => handleChange('next_payroll_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Payroll Provider</Label>
        <Input
          value={value.payroll_provider || ''}
          onChange={(e) => handleChange('payroll_provider', e.target.value)}
          placeholder="e.g., ADP, Paychex"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          value={value.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
} 
```

### `src\components\projects\form\service-fields\TaxInfoFields.tsx`

```typescript
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxInfo } from '@/types/projects';

interface TaxInfoFieldsProps {
  value: TaxInfo;
  onChange: (value: TaxInfo) => void;
}

export function TaxInfoFields({ value, onChange }: TaxInfoFieldsProps) {
  const handleChange = (field: keyof TaxInfo, newValue: string | number) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Return Type</Label>
        <Select
          value={value.return_type || ''}
          onValueChange={(newValue) => handleChange('return_type', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select return type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1040">1040 - Individual</SelectItem>
            <SelectItem value="1120">1120 - Corporation</SelectItem>
            <SelectItem value="1120s">1120S - S Corporation</SelectItem>
            <SelectItem value="1065">1065 - Partnership</SelectItem>
            <SelectItem value="990">990 - Non-Profit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Filing Status</Label>
        <Select
          value={value.filing_status || ''}
          onValueChange={(newValue) => handleChange('filing_status', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
            <SelectItem value="married_separate">Married Filing Separately</SelectItem>
            <SelectItem value="head_household">Head of Household</SelectItem>
            <SelectItem value="qualifying_widow">Qualifying Widow(er)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tax Year</Label>
        <Input
          type="number"
          value={value.tax_year || ''}
          onChange={(e) => handleChange('tax_year', parseInt(e.target.value, 10))}
          placeholder="Enter tax year"
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <Input
          type="date"
          value={value.due_date || ''}
          onChange={(e) => handleChange('due_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Extension Date</Label>
        <Input
          type="date"
          value={value.extension_date || ''}
          onChange={(e) => handleChange('extension_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Estimated Refund</Label>
        <Input
          type="number"
          value={value.estimated_refund || ''}
          onChange={(e) => handleChange('estimated_refund', parseFloat(e.target.value))}
          placeholder="Enter estimated refund amount"
        />
      </div>

      <div className="space-y-2">
        <Label>Estimated Liability</Label>
        <Input
          type="number"
          value={value.estimated_liability || ''}
          onChange={(e) => handleChange('estimated_liability', parseFloat(e.target.value))}
          placeholder="Enter estimated liability amount"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          value={value.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
} 
```

### `src\components\forms\project\basic-info-form.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { Tables } from '@/types/database.types';

type Client = Tables<'clients'>;
type ProjectTemplate = Tables<'project_templates'> & {
  tasks: Tables<'template_tasks'>[];
};

interface BasicInfoFormProps {
  form: UseFormReturn<ProjectFormValues>;
  clients: Client[];
  templates?: ProjectTemplate[];
  templatesLoading?: boolean;
}

export function BasicInfoForm({ 
  form, 
  clients,
  templates = [],
  templatesLoading = false 
}: BasicInfoFormProps) {
  // Group clients by type and create appropriate labels
  const clientOptions = clients
    .sort((a, b) => {
      // Sort by type first, then by name
      if (a.type !== b.type) {
        return a.type === 'business' ? -1 : 1;
      }
      // For businesses, sort by company name
      if (a.type === 'business') {
        return (a.company_name || '').localeCompare(b.company_name || '');
      }
      // For individuals, sort by full name
      return (a.full_name || '').localeCompare(b.full_name || '');
    })
    .map(client => ({
      value: client.id,
      label: client.type === 'business' 
        ? `${client.company_name || 'Unnamed Business'}`
        : `${client.full_name || 'Unnamed Individual'}`,
      group: client.type === 'business' ? 'Business Clients' : 'Individual Clients'
    }));

  const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.title
  }));

  return (
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
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Business Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Business Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Individual Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Individual Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
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
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map(option => (
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
          name="description"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  value={value || ''}
                  onChange={onChange}
                  {...field}
                  placeholder="Enter project description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

```

### `src\components\forms\project\service-details-form.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectField } from '../shared/select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { ServiceType } from '@/types/projects';
import { Tables } from '@/types/database.types';

interface ServiceDetailsFormProps {
  form: UseFormReturn<ProjectFormValues>;
  taxReturns?: Tables<'tax_returns'>[];
  loading?: boolean;
}

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'advisory', label: 'Advisory' }
];

const TAX_RETURN_STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review_needed', label: 'Review Needed' },
  { value: 'completed', label: 'Completed' }
];

export function ServiceDetailsForm({ form, taxReturns = [], loading = false }: ServiceDetailsFormProps) {
  const watchedServiceType = form.watch('service_type') as ServiceType;
  const watchedClientId = form.watch('client_id');

  const clientTaxReturns = taxReturns.filter(tr => tr.client_id === watchedClientId);
  const taxReturnOptions = clientTaxReturns.map(tr => ({
    value: tr.id.toString(),
    label: `${tr.tax_year || 'Unknown Year'} - ${tr.filing_type || 'Unspecified Type'}`
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectField
          form={form}
          name="service_type"
          label="Service Type"
          options={SERVICE_OPTIONS}
          placeholder="Select service type"
        />

        {watchedServiceType === 'tax_return' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tax Return Details</h3>
            <SelectField
              form={form}
              name="tax_return_id"
              label="Tax Return"
              options={taxReturnOptions}
              placeholder={loading ? "Loading tax returns..." : "Select tax return"}
              description="Select the tax return this project is for"
            />
            <SelectField
              form={form}
              name="tax_return_status"
              label="Initial Status"
              options={TAX_RETURN_STATUS_OPTIONS}
              placeholder="Select initial status"
              defaultValue="not_started"
            />
          </div>
        )}

        {watchedServiceType === 'bookkeeping' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Bookkeeping Details</h3>
            <SelectField
              form={form}
              name="accounting_period"
              label="Accounting Period"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annual', label: 'Annual' }
              ]}
              placeholder="Select period"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

### `src\components\forms\project\task-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskFormData } from '@/types/tasks';

interface TaskFormProps {
  defaultValues?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
}

export function TaskForm({ defaultValues, onSubmit }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    defaultValues: defaultValues || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium'
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}

```

### `src\components\forms\project\timeline-team-form.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerField } from '../shared/date-picker-field';
import { MultiSelectField } from '../shared/multi-select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { TaskForm } from './task-form';

interface TimelineTeamFormProps {
  form: UseFormReturn<ProjectFormValues>;
  teamMembers: Array<{ id: string; name: string; }>;
}

export function TimelineTeamForm({ form, teamMembers }: TimelineTeamFormProps) {
  const teamMemberOptions = teamMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  const handleAddTask = () => {
    const currentTasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', [
      ...currentTasks,
      {
        title: '',
        description: '',
        priority: 'medium',
        dependencies: [],
        assigned_team: [],
        status: 'not_started',
        progress: 0
      }
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline & Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            form={form}
            name="due_date"
            label="Due Date"
          />

          <MultiSelectField
            form={form}
            name="team_members"
            label="Team Members"
            options={teamMemberOptions}
            placeholder="Select team members"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Tasks</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </div>

          {form.watch('template_tasks')?.map((_, index) => (
            <TaskForm
              key={index}
              defaultValues={{
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium'
              }}
              onSubmit={async (data) => {
                // Handle task submission
                console.log('Task submitted:', data)
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

```

### `src\components\forms\shared\date-picker-field.tsx`

```typescript
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';

interface DatePickerFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePickerField({
  form,
  name,
  label,
  placeholder = "Pick a date",
  disabled = (date) => date < new Date() || date < new Date("1900-01-01")
}: DatePickerFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
                    <span>{placeholder}</span>
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
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

```

### `src\components\forms\shared\multi-select-field.tsx`

```typescript
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  description?: string;
}

export function MultiSelectField({
  form,
  name,
  label,
  options,
  placeholder = "Select options",
  description
}: MultiSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            selected={field.value || []}
            options={options}
            onChange={field.onChange}
            placeholder={placeholder}
          />
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

```

### `src\components\forms\shared\select-field.tsx`

```typescript
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
  description?: string;
}

export function SelectField({
  form,
  name,
  label,
  options,
  placeholder = "Select an option",
  defaultValue,
  description
}: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue || field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

```

### `src\lib\validations\auth.ts`

```typescript
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>; 
```

### `src\lib\validations\client.ts`

```typescript
import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

const emailSchema = z.string()
  .email('Invalid email address')
  .nullable();

const phoneSchema = z.string()
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .nullable();

const zipSchema = z.string()
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
  .nullable();

// Define JSON field schemas
const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().length(2, 'State should be a 2-letter code').nullable(),
  zip: zipSchema,
  alternate_email: emailSchema,
  alternate_phone: phoneSchema,
  preferred_contact_method: z.enum(['email', 'phone']).nullable(),
  notes: z.string().nullable(),
}).nullable();

const dependentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format').nullable(),
  relationship: z.string().nullable(),
  birth_date: dateSchema,
});

const previousReturnSchema = z.object({
  year: z.number().min(1900).max(new Date().getFullYear()),
  filed_date: dateSchema,
  preparer: z.string().nullable(),
  notes: z.string().nullable(),
});

const taxInfoSchema = z.object({
  filing_status: z.string().nullable(),
  tax_id: z.string().nullable(),
  tax_year: z.number().min(1900).max(new Date().getFullYear() + 1).nullable(),
  last_filed_date: dateSchema,
  filing_type: z.enum(['individual', 'business', 'partnership', 'corporation', 's_corporation', 'non_profit'] as const satisfies readonly DbEnums['filing_type']).nullable(),
  tax_id_type: z.enum(['ssn', 'ein']).nullable(),
  dependents: z.array(dependentSchema).nullable(),
  previous_returns: z.array(previousReturnSchema).nullable(),
}).nullable();

// Main client form schema
export const clientFormSchema = z.object({
  // Required fields
  contact_email: z.string().email('Invalid contact email'),
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['client_status']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  full_name: z.string().min(1, 'Full name is required').nullable(),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().length(2, 'State should be a 2-letter code').nullable(),
  zip: zipSchema,
  company_name: z.string().nullable(),
  business_type: z.string().nullable(),
  tax_id: z.string().nullable(),
  notes: z.string().nullable(),
  onboarding_notes: z.string().nullable(),
  business_tax_id: z.string().regex(/^\d{2}-?\d{7}$/, 'Invalid EIN format').nullable(),
  individual_tax_id: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format').nullable(),
  industry_code: z.string().regex(/^\d{6}$/, 'Invalid NAICS code format').nullable(),
  fiscal_year_end: dateSchema,
  accounting_method: z.enum(['cash', 'accrual']).nullable(),
  document_deadline: dateSchema,
  last_contact_date: dateSchema,
  last_filed_date: dateSchema,
  next_appointment: dateSchema,
  primary_contact_name: z.string().nullable(),
  assigned_preparer_id: z.string().uuid('Invalid UUID format').nullable(),
  user_id: z.string().uuid('Invalid UUID format').nullable(),
  tax_return_status: z.string().nullable(),
  type: z.enum(['business', 'individual'] as const satisfies readonly DbEnums['client_type']).nullable(),
  
  // JSON fields
  contact_details: z.object({
    phone: phoneSchema,
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().length(2, 'State should be a 2-letter code').nullable(),
    zip: zipSchema,
  }).nullable(),
  tax_info: taxInfoSchema,
});

// Export types
export type ClientFormSchema = z.infer<typeof clientFormSchema>;

// Validation helpers
export function validateClientForm(data: unknown): { success: true; data: ClientFormSchema } | { success: false; error: z.ZodError } {
  const result = clientFormSchema.safeParse(data);
  return result;
}

export function validateContactInfo(data: unknown) {
  return contactInfoSchema.safeParse(data);
}

export function validateTaxInfo(data: unknown) {
  return taxInfoSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<ClientFormSchema>): { success: true; data: ClientFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['contact_email', 'status'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as ClientFormSchema
  };
} 
```

### `src\lib\validations\project.ts`

```typescript
import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

// Main project form schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_id: z.string().uuid('Invalid client ID'),
  template_id: z.string().uuid('Invalid template ID').optional(),
  service_type: z.enum(['tax_return', 'bookkeeping', 'payroll', 'advisory']).nullable(),
  status: z.enum(['not_started', 'on_hold', 'cancelled', 'todo', 'in_progress', 'review', 'blocked', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  due_date: z.string().datetime().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  tax_info: z.any().nullable(),
  accounting_info: z.any().nullable(),
  payroll_info: z.any().nullable(),
  service_info: z.any().nullable(),
  tax_return_id: z.string().uuid('Invalid tax return ID').nullable(),
  parent_project_id: z.string().uuid('Invalid parent project ID').nullable(),
  primary_manager: z.string().uuid('Invalid manager ID').nullable(),
  stage: z.string().nullable(),
  completed_tasks: z.number().nullable(),
  completion_percentage: z.number().nullable(),
  task_count: z.number().nullable(),
  template_tasks: z.array(z.custom<DbTaskInsert>()).optional(),
});

// Export types
export type ProjectFormSchema = z.infer<typeof projectSchema>;
export type ProjectFormValues = ProjectFormSchema;
export type ProjectFormData = ProjectFormSchema;

// Validation helpers
export function validateProjectForm(data: unknown): { success: true; data: ProjectFormSchema } | { success: false; error: z.ZodError } {
  const result = projectSchema.safeParse(data);
  return result;
}

```

### `src\lib\validations\schema.ts`

```typescript
import { z } from 'zod'
import { 
  CLIENT_STATUS, 
  CLIENT_TYPE, 
  FILING_TYPE 
} from '@/types/clients'
import {
  PROJECT_STATUS,
  SERVICE_TYPE
} from '@/types/projects'
import {
  TASK_STATUS,
  TASK_PRIORITY
} from '@/types/tasks'

// Client Schemas
export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  alternate_email: z.string().email().optional(),
  alternate_phone: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone']).optional(),
  notes: z.string().optional()
})

export const taxInfoSchema = z.object({
  filing_type: z.enum(FILING_TYPE),
  tax_id_type: z.enum(['ssn', 'ein']).optional(),
  tax_id: z.string().optional(),
  filing_status: z.string().optional(),
  dependents: z.array(z.object({
    name: z.string(),
    ssn: z.string().optional(),
    relationship: z.string().optional(),
    birth_date: z.string().optional()
  })).optional(),
  previous_returns: z.array(z.object({
    year: z.number(),
    filed_date: z.string(),
    preparer: z.string().optional(),
    notes: z.string().optional()
  })).optional()
})

export const clientSchema = z.object({
  contact_email: z.string().email(),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  status: z.enum(CLIENT_STATUS),
  type: z.enum(CLIENT_TYPE),
  contact_info: contactInfoSchema,
  tax_info: taxInfoSchema.nullable(),
  business_tax_id: z.string().optional(),
  individual_tax_id: z.string().optional()
})

// Project Schemas
export const projectTaxInfoSchema = z.object({
  return_type: z.enum(FILING_TYPE),
  tax_year: z.number(),
  filing_status: z.string().optional(),
  is_extension_filed: z.boolean().optional(),
  extension_date: z.string().optional(),
  documents_received: z.boolean().optional(),
  last_filed_date: z.string().optional()
})

export const accountingInfoSchema = z.object({
  fiscal_year_end: z.string().optional(),
  accounting_method: z.enum(['cash', 'accrual']).optional(),
  last_reconciliation_date: z.string().optional(),
  software: z.string().optional(),
  chart_of_accounts_setup: z.boolean().optional(),
  notes: z.string().optional()
})

export const payrollInfoSchema = z.object({
  frequency: z.enum(['weekly', 'bi-weekly', 'monthly']).optional(),
  employee_count: z.number().optional(),
  last_payroll_date: z.string().optional(),
  next_payroll_date: z.string().optional(),
  tax_deposit_schedule: z.enum(['monthly', 'semi-weekly']).optional(),
  notes: z.string().optional()
})

export const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUS),
  service_type: z.enum(SERVICE_TYPE),
  client_id: z.string().optional(),
  primary_manager: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  end_date: z.string().optional(),
  tax_info: projectTaxInfoSchema.nullable(),
  accounting_info: accountingInfoSchema.nullable(),
  payroll_info: payrollInfoSchema.nullable(),
  service_info: z.record(z.unknown()).nullable()
})

// Task Schemas
export const taskRecurringConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number(),
  end_date: z.string().optional(),
  end_occurrences: z.number().optional()
})

export const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(TASK_STATUS),
  priority: z.enum(TASK_PRIORITY).optional(),
  project_id: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  start_date: z.string().optional(),
  progress: z.number().optional(),
  recurring_config: taskRecurringConfigSchema.nullable(),
  parent_task_id: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional()
}) 
```

### `src\lib\validations\task.ts`

```typescript
import { z } from 'zod'
import { TaskStatus, TaskPriority, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().nullable().optional(),
  status: z.enum(taskStatusOptions),
  priority: z.enum(taskPriorityOptions).nullable().optional(),
  project_id: z.string().uuid('Invalid project ID').nullable().optional(),
  assignee_id: z.string().uuid('Invalid assignee ID').nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  tax_form_type: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
})

export type TaskFormSchema = z.infer<typeof taskFormSchema>

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ['in_progress', 'review'],
  in_progress: ['todo', 'review', 'completed'],
  review: ['in_progress', 'completed'],
  completed: ['review']
} as const

// Utility type for valid status transitions
export type ValidStatusTransition<T extends TaskStatus> = typeof taskStatusTransitions[T][number]
```

### `src\lib\validations\template-category.ts`

```typescript
import { z } from 'zod';
import { Database } from '@/types/database.types';

type TemplateCategoryRow = Database['public']['Tables']['template_categories']['Row']

// Helper type for dates
const dateSchema = z.union([
  z.string(),
  z.date(),
  z.null()
]).transform(val => {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  return val;
});

// Template category schema
export const templateCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  position: z.number().optional().nullable(),
  created_at: dateSchema,
  updated_at: dateSchema,
}) satisfies z.ZodType<TemplateCategoryRow>;

// Export types
export type TemplateCategoryFormValues = z.infer<typeof templateCategorySchema>; 
```

### `src\lib\validations\template.ts`

```typescript
import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

// Define JSON field schemas
const taskTemplateSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  title: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  dependencies: z.array(z.string().uuid('Invalid UUID format')).nullable(),
  checklist: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
  })).nullable(),
}).nullable();

const workflowTemplateSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  name: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  stages: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
    tasks: z.array(taskTemplateSchema).nullable(),
  })).nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main template form schema
export const templateFormSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Template name is required'),
  status: z.enum(['active', 'inactive', 'draft', 'archived'] as const satisfies readonly DbEnums['template_status']),
  type: z.enum(['project', 'task', 'workflow', 'document', 'email', 'other'] as const satisfies readonly DbEnums['template_type']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  version: z.string().nullable(),
  category: z.string().nullable(),
  owner_id: z.string().uuid('Invalid owner ID').nullable(),
  team_id: z.string().uuid('Invalid team ID').nullable(),
  parent_template_id: z.string().uuid('Invalid parent template ID').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  task_templates: z.array(taskTemplateSchema).nullable(),
  workflow_templates: z.array(workflowTemplateSchema).nullable(),
  custom_fields: customFieldsSchema,
});

// Export types
export type TemplateFormSchema = z.infer<typeof templateFormSchema>;

// Validation helpers
export function validateTemplateForm(data: unknown): { success: true; data: TemplateFormSchema } | { success: false; error: z.ZodError } {
  const result = templateFormSchema.safeParse(data);
  return result;
}

export function validateTaskTemplates(data: unknown) {
  return z.array(taskTemplateSchema).safeParse(data);
}

export function validateWorkflowTemplates(data: unknown) {
  return z.array(workflowTemplateSchema).safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<TemplateFormSchema>): { success: true; data: TemplateFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['name', 'status', 'type'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as TemplateFormSchema
  };
} 
```

### `src\lib\validations\user.ts`

```typescript
import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

const emailSchema = z.string()
  .email('Invalid email address')
  .nullable();

const phoneSchema = z.string()
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .nullable();

// Define JSON field schemas
const profileSchema = z.object({
  bio: z.string().nullable(),
  avatar_url: z.string().url('Invalid avatar URL').nullable(),
  timezone: z.string().nullable(),
  language: z.string().nullable(),
  theme: z.enum(['light', 'dark', 'system']).nullable(),
  notification_preferences: z.object({
    email: z.boolean().nullable(),
    push: z.boolean().nullable(),
    sms: z.boolean().nullable(),
  }).nullable(),
  social_links: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').nullable(),
    twitter: z.string().url('Invalid Twitter URL').nullable(),
    github: z.string().url('Invalid GitHub URL').nullable(),
  }).nullable(),
}).nullable();

const settingsSchema = z.object({
  email_notifications: z.boolean().nullable(),
  push_notifications: z.boolean().nullable(),
  sms_notifications: z.boolean().nullable(),
  two_factor_enabled: z.boolean().nullable(),
  default_view: z.enum(['list', 'board', 'calendar', 'timeline']).nullable(),
  default_project_view: z.enum(['list', 'board', 'calendar', 'timeline']).nullable(),
  default_task_view: z.enum(['list', 'board', 'calendar', 'timeline']).nullable(),
  default_client_view: z.enum(['list', 'board', 'calendar', 'timeline']).nullable(),
  theme: z.enum(['light', 'dark', 'system']).nullable(),
  timezone: z.string().nullable(),
  language: z.string().nullable(),
  date_format: z.string().nullable(),
  time_format: z.string().nullable(),
  currency: z.string().length(3, 'Currency code must be 3 letters').nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main user form schema
export const userFormSchema = z.object({
  // Required fields
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'preparer', 'reviewer', 'client'] as const satisfies readonly DbEnums['user_role']),
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['user_status']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  full_name: z.string().min(1, 'Full name is required').nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  phone: phoneSchema,
  alternate_email: emailSchema,
  alternate_phone: phoneSchema,
  title: z.string().nullable(),
  department: z.string().nullable(),
  manager_id: z.string().uuid('Invalid manager ID').nullable(),
  team_id: z.string().uuid('Invalid team ID').nullable(),
  permissions: z.array(z.string()).nullable(),
  last_login: dateSchema,
  last_active: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  profile: profileSchema,
  settings: settingsSchema,
  custom_fields: customFieldsSchema,
});

// Export types
export type UserFormSchema = z.infer<typeof userFormSchema>;

// Validation helpers
export function validateUserForm(data: unknown): { success: true; data: UserFormSchema } | { success: false; error: z.ZodError } {
  const result = userFormSchema.safeParse(data);
  return result;
}

export function validateProfile(data: unknown) {
  return profileSchema.safeParse(data);
}

export function validateSettings(data: unknown) {
  return settingsSchema.safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<UserFormSchema>): { success: true; data: UserFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['email', 'role', 'status'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as UserFormSchema
  };
} 
```

### `src\lib\validations\utils.ts`

```typescript
import { z } from 'zod'
import { 
  clientSchema,
  projectSchema,
  taskSchema
} from './schema'

// Type inference helpers
export type InferredClient = z.infer<typeof clientSchema>
export type InferredProject = z.infer<typeof projectSchema>
export type InferredTask = z.infer<typeof taskSchema>

// Validation helpers
export const validateClient = (data: unknown) => {
  return clientSchema.parse(data)
}

export const validateProject = (data: unknown) => {
  return projectSchema.parse(data)
}

export const validateTask = (data: unknown) => {
  return taskSchema.parse(data)
}

// Safe parsers that return Result type
export const safeParseClient = (data: unknown) => {
  return clientSchema.safeParse(data)
}

export const safeParseProject = (data: unknown) => {
  return projectSchema.safeParse(data)
}

export const safeParseTask = (data: unknown) => {
  return taskSchema.safeParse(data)
}

// Partial validators for updates
export const validatePartialClient = (data: unknown) => {
  return clientSchema.partial().parse(data)
}

export const validatePartialProject = (data: unknown) => {
  return projectSchema.partial().parse(data)
}

export const validatePartialTask = (data: unknown) => {
  return taskSchema.partial().parse(data)
}

// Type guards
export const isClient = (data: unknown): data is InferredClient => {
  return clientSchema.safeParse(data).success
}

export const isProject = (data: unknown): data is InferredProject => {
  return projectSchema.safeParse(data).success
}

export const isTask = (data: unknown): data is InferredTask => {
  return taskSchema.safeParse(data).success
}

// Error formatting
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }))
}

// Validation with custom error messages
export const validateWithCustomErrors = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  customErrors?: Record<string, string>
) => {
  try {
    return { success: true, data: schema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: customErrors?.[err.path.join('.')] || err.message
      }))
      return { success: false, errors: formattedErrors }
    }
    throw error
  }
} 
```

### `src\lib\validations\workflow.ts`

```typescript
import { z } from 'zod';
import type { Database } from '@/types/database.types';

type DbEnums = Database['public']['Enums'];

// Helper schemas
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .nullable();

// Define JSON field schemas
const stageSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  name: z.string(),
  description: z.string().nullable(),
  order_index: z.number().min(0),
  required: z.boolean().nullable(),
  auto_assign: z.boolean().nullable(),
  assigned_to: z.string().uuid('Invalid UUID format').nullable(),
  estimated_duration: z.number().min(0).nullable(),
  checklist: z.array(z.object({
    title: z.string(),
    required: z.boolean().nullable(),
    description: z.string().nullable(),
  })).nullable(),
}).nullable();

const triggerSchema = z.object({
  event: z.string(),
  condition: z.string().nullable(),
  action: z.string(),
  target: z.string().nullable(),
  parameters: z.record(z.string(), z.unknown()).nullable(),
  enabled: z.boolean().nullable(),
}).nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main workflow form schema
export const workflowFormSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Workflow name is required'),
  status: z.enum(['active', 'inactive', 'draft', 'archived'] as const satisfies readonly DbEnums['workflow_status']),
  type: z.enum(['tax_return', 'audit', 'advisory', 'bookkeeping', 'payroll', 'other'] as const satisfies readonly DbEnums['workflow_type']),
  
  // Optional fields with validation
  id: z.string().uuid('Invalid UUID format').optional(),
  description: z.string().nullable(),
  version: z.string().nullable(),
  template_id: z.string().uuid('Invalid template ID').nullable(),
  project_id: z.string().uuid('Invalid project ID').nullable(),
  client_id: z.string().uuid('Invalid client ID').nullable(),
  owner_id: z.string().uuid('Invalid owner ID').nullable(),
  team_id: z.string().uuid('Invalid team ID').nullable(),
  start_date: dateSchema,
  end_date: dateSchema,
  due_date: dateSchema,
  completion_date: dateSchema,
  estimated_duration: z.number().min(0).nullable(),
  actual_duration: z.number().min(0).nullable(),
  progress: z.number().min(0).max(100).nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const satisfies readonly DbEnums['priority_level']).nullable(),
  notes: z.string().nullable(),
  attachments: z.array(z.string().url('Invalid attachment URL')).nullable(),
  last_updated: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  
  // JSON fields
  stages: z.array(stageSchema).nullable(),
  triggers: z.array(triggerSchema).nullable(),
  custom_fields: customFieldsSchema,
});

// Export types
export type WorkflowFormSchema = z.infer<typeof workflowFormSchema>;

// Validation helpers
export function validateWorkflowForm(data: unknown): { success: true; data: WorkflowFormSchema } | { success: false; error: z.ZodError } {
  const result = workflowFormSchema.safeParse(data);
  return result;
}

export function validateStages(data: unknown) {
  return z.array(stageSchema).safeParse(data);
}

export function validateTriggers(data: unknown) {
  return z.array(triggerSchema).safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(data: Partial<WorkflowFormSchema>): { success: true; data: WorkflowFormSchema } | { success: false; error: string[] } {
  const requiredFields = ['name', 'status', 'type'] as const;
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map(field => `Missing required field: ${field}`)
    };
  }

  return {
    success: true,
    data: data as WorkflowFormSchema
  };
} 
```

### `src\lib\services\task.service.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { TaskPriority, TaskStatus } from '@/types/tasks'

const supabase = createClientComponentClient<Database>()

// Onboarding task templates for different service types
const onboardingTaskTemplates = {
  'individual': [
    {
      title: 'Initial Client Meeting',
      description: 'Schedule and conduct initial meeting to understand client needs and gather basic information',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Document Collection',
      description: 'Request and collect all necessary tax documents from client',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date
      }
    },
    {
      title: 'Tax Return Preparation',
      description: 'Prepare individual tax return based on collected documents',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date
      }
    }
  ],
  'business': [
    {
      title: 'Business Onboarding Meeting',
      description: 'Set up initial meeting to understand business structure and requirements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        return date
      }
    },
    {
      title: 'Financial Document Collection',
      description: 'Collect business financial documents and statements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Business Tax Planning',
      description: 'Develop initial tax planning strategy based on business type and needs',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 5)
        return date
      }
    }
  ]
}

export async function generateOnboardingTasks(clientId: string, clientType: Database['public']['Enums']['client_type']) {
  try {
    const templates = onboardingTaskTemplates[clientType]
    if (!templates) {
      throw new Error(`No task templates found for client type: ${clientType}`)
    }

    const tasksToCreate = templates.map(template => ({
      title: template.title,
      description: template.description,
      status: 'todo' as TaskStatus,
      priority: template.priority,
      due_date: template.estimateDueDate()?.toISOString(),
      client_id: clientId,
      category: 'onboarding',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksToCreate)
      .select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error generating onboarding tasks:', error)
    throw error
  }
}

export async function createTask(taskData: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function updateTask(taskId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export async function getTasksByClient(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
} 
```

### `src\lib\utils\project-form.ts`

```typescript
import { ProjectFormValues, ProjectWithRelations } from '@/types/projects';

export function getProjectFormDefaults(project?: ProjectWithRelations): Partial<ProjectFormValues> {
  if (!project) return {};
  
  return {
    creation_type: project.template_id ? 'template' : 'custom',
    template_id: project.template_id,
    name: project.name,
    description: project.description,
    client_id: project.client_id || '',
    status: project.status,
    priority: project.priority,
    service_type: project.service_type || 'tax_return',
    due_date: project.due_date,
    tax_info: project.tax_info,
    accounting_info: project.accounting_info,
    payroll_info: project.payroll_info,
    tasks: project.tasks || [],
    team_members: project.team_members?.map(member => member.user_id) || [],
    tax_return_id: project.tax_return_id,
    tax_return_status: null,
    accounting_period: null,
    start_date: project.start_date,
    end_date: project.end_date,
    parent_project_id: project.parent_project_id,
    primary_manager: project.primary_manager,
    completed_tasks: project.completed_tasks || 0,
    completion_percentage: project.completion_percentage || 0,
    task_count: project.task_count || 0,
    stage: project.stage,
    service_info: project.service_info,
    project_defaults: null
  };
} 
```

### `src\lib\utils\time.ts`

```typescript
export function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

export function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60 * 100) / 100;
}

export function roundToNearest(value: number, nearest: number = 1): number {
  return Math.round(value / nearest) * nearest;
}
```


## File Analysis

| File | Lines | Size (KB) |
|------|-------|------------|
| src/types/database.types.ts | 500 | 14.0 |
| src\types\database.types.ts | 500 | 14.0 |
| src/components/tasks/task-side-panel.tsx | 349 | 10.8 |
| src\components\tasks\task-side-panel.tsx | 349 | 10.8 |
| src\hooks\useProjectManagement.ts | 285 | 10.0 |
| src\components\projects\project-filters.tsx | 271 | 9.2 |
| src/app/api/tasks/route.ts | 245 | 6.7 |
| src\hooks\useProjects.tsx | 231 | 6.4 |
| src/components/ui/form.tsx | 205 | 4.7 |
| src\components\tasks\task-form.tsx | 200 | 6.1 |
| src\hooks\use-toast.ts | 194 | 3.9 |
| docs/PHASE1.MD | 192 | 4.3 |
| src\components\projects\project-card.tsx | 192 | 6.2 |
| src\hooks\useClientOnboarding.ts | 184 | 4.9 |
| src\hooks\useTaxReturns.ts | 184 | 4.9 |
| src/types/projects.ts | 183 | 6.0 |
| src\types\projects.ts | 183 | 6.0 |
| src/lib/services/task.service.ts | 182 | 4.5 |
| src\lib\services\task.service.ts | 182 | 4.5 |
| src\hooks\useWorkflows.ts | 173 | 4.5 |
| src\components\forms\project\basic-info-form.tsx | 172 | 5.7 |
| src\hooks\useTimeEntries.ts | 170 | 4.5 |
| src/components/tasks/task-dialog.tsx | 156 | 5.4 |
| src\components\tasks\task-dialog.tsx | 156 | 5.4 |
| src\types\clients.ts | 147 | 4.8 |
| src\lib\validations\client.ts | 141 | 4.9 |
| src\components\projects\create-project-dialog.tsx | 140 | 4.2 |
| src/components/projects/project-details.tsx | 135 | 4.8 |
| src\components\projects\project-details.tsx | 135 | 4.8 |
| src/lib/validations/schema.ts | 133 | 4.0 |
| src\lib\validations\schema.ts | 133 | 4.0 |
| src\components\tasks\progress-tracker.tsx | 130 | 3.7 |
| src/components/tasks/task-list.tsx | 129 | 4.0 |
| src\hooks\useTasks.ts | 129 | 3.8 |
| src\types\validation.ts | 129 | 3.8 |
| src\components\tasks\task-list.tsx | 129 | 4.0 |
| src\hooks\useProjectForm.ts | 128 | 3.4 |
| src\lib\validations\user.ts | 125 | 4.3 |
| src\components\projects\project-header.tsx | 121 | 4.0 |
| src\hooks\useNotes.ts | 120 | 2.8 |
| src\hooks\usePayrollServices.ts | 120 | 3.0 |
| src\components\projects\form\service-fields\TaxInfoFields.tsx | 119 | 3.8 |
| src\hooks\useTaxProjectManagement.ts | 116 | 3.4 |
| src\hooks\useUsers.ts | 114 | 3.0 |
| src\types\hooks.ts | 114 | 3.1 |
| src\lib\validations\template.ts | 114 | 4.1 |
| src\components\projects\form\service-fields\AccountingInfoFields.tsx | 113 | 3.4 |
| src\lib\validations\workflow.ts | 112 | 3.9 |
| src\hooks\useProjectFilters.ts | 111 | 3.3 |
| src\hooks\useTemplateTasks.ts | 111 | 2.9 |
| src/hooks/useTaskManagement.ts | 99 | 2.9 |
| src\hooks\useTaskManagement.ts | 99 | 2.9 |
| src\lib\supabase\dashboardQueries.ts | 97 | 3.7 |
| src\components\projects\form\TaskSection.tsx | 96 | 2.5 |
| src\components\forms\project\service-details-form.tsx | 95 | 3.2 |
| src\types\auth.ts | 93 | 2.0 |
| src\hooks\useProjectTemplates.ts | 92 | 2.5 |
| src\components\forms\project\timeline-team-form.tsx | 92 | 2.5 |
| src\lib\validations\utils.ts | 91 | 2.3 |
| src\components\projects\form\BasicInfoSection.tsx | 90 | 2.6 |
| src\components\projects\form\service-fields\PayrollInfoFields.tsx | 90 | 2.7 |
| src\hooks\useProjectAnalytics.ts | 86 | 2.8 |
| src\hooks\useStorage.ts | 86 | 2.2 |
| src\components\projects\form\ProjectForm.tsx | 86 | 2.8 |
| src\hooks\useTaskValidation.ts | 85 | 2.4 |
| src\lib\supabase\supabase-provider.tsx | 79 | 2.0 |
| src\hooks\useDocuments.ts | 79 | 2.1 |
| src\hooks\useProjectSubmission.ts | 78 | 2.5 |
| src\lib\supabase\tasks.ts | 77 | 1.7 |
| src/hooks/useProjects.ts | 75 | 2.0 |
| src\hooks\useProjects.ts | 75 | 2.0 |
| src\components\tasks\project-tasks.tsx | 75 | 1.8 |
| src\components\projects\project-form.tsx | 74 | 2.4 |
| src\components\projects\project-list.tsx | 73 | 1.8 |
| src\components\forms\shared\date-picker-field.tsx | 68 | 2.0 |
| src/components/projects/project-tasks.tsx | 67 | 1.9 |
| src\components\projects\project-tasks.tsx | 67 | 1.9 |
| src\components\projects\form\ProjectFormTabs.tsx | 67 | 2.2 |
| src\components\tasks\task-item.tsx | 66 | 1.9 |
| src\components\forms\project\task-form.tsx | 64 | 1.6 |
| src\hooks\use-users.ts | 63 | 1.7 |
| src\components\projects\project-group.tsx | 62 | 1.6 |
| src\components\forms\shared\select-field.tsx | 61 | 1.5 |
| src\components\dashboard\overview.tsx | 60 | 2.0 |
| src\components\tasks\task-container.tsx | 60 | 1.3 |
| src\components\projects\form\ServiceDetailsSection.tsx | 60 | 2.0 |
| src\lib\api\templates.ts | 56 | 1.3 |
| src\lib\api\projects.ts | 54 | 1.5 |
| src\components\dashboard\task-queue.tsx | 54 | 1.7 |
| src\components\dashboard\dashboard-tabs.tsx | 53 | 1.5 |
| src/app/error.tsx | 49 | 1.1 |
| src\hooks\use-protected-route.ts | 49 | 1.4 |
| src\components\forms\shared\multi-select-field.tsx | 48 | 1.1 |
| src\components\tasks\task-error-boundary.tsx | 47 | 1.1 |
| src\hooks\useAITasks.ts | 43 | 1.1 |
| src\hooks\useServiceFields.ts | 43 | 1.2 |
| src\types\templates.ts | 42 | 1.9 |
| src\lib\validations\project.ts | 41 | 1.8 |
| src\hooks\useClients.ts | 40 | 1.2 |
| src\types\users.ts | 37 | 1.3 |
| src\components\projects\form\ProjectFormContext.tsx | 37 | 0.8 |
| src\components\projects\new-project-button.tsx | 36 | 0.9 |
| src\lib\utils\project-form.ts | 35 | 1.3 |
| src\types\workflows.ts | 34 | 1.1 |
| src\app\dashboard\layout.tsx | 33 | 0.9 |
| src\app\dashboard\page.tsx | 33 | 1.0 |
| src\components\dashboard\revenue-card.tsx | 33 | 1.0 |
| src\components\dashboard\subscriptions-card.tsx | 33 | 1.0 |
| src\components\projects\project-filters-wrapper.tsx | 31 | 0.8 |
| src\hooks\useSmartProjectFilters.ts | 29 | 0.8 |
| src\components\dashboard\error-view.tsx | 29 | 0.7 |
| src\components\projects\form\ProjectFormHeader.tsx | 29 | 0.7 |
| src\lib\validations\template-category.ts | 29 | 0.9 |
| src/components/tasks/task-card.tsx | 28 | 0.9 |
| src/lib/validations/task.ts | 28 | 1.1 |
| src\hooks\useSmartTemplates.ts | 28 | 0.9 |
| src\components\tasks\task-card.tsx | 28 | 0.9 |
| src\lib\validations\task.ts | 28 | 1.1 |
| src\lib\supabase\supabase.ts | 26 | 0.7 |
| src/types/tasks.ts | 25 | 0.9 |
| src\types\tasks.ts | 25 | 0.9 |
| src\hooks\useProjectTabProgress.ts | 23 | 0.7 |
| src\components\dashboard\recent-activity.tsx | 23 | 0.6 |
| src\hooks\use-debounce.tsx | 19 | 0.4 |
| src\hooks\use-mobile.tsx | 19 | 0.6 |
| src\lib\validations\auth.ts | 15 | 0.5 |
| src\types\time_entries.ts | 13 | 0.2 |
| src\lib\utils\time.ts | 11 | 0.3 |
| src\components\dashboard\focus-now-dashboard.tsx | 10 | 0.2 |
| src\components\dashboard\smart-queue.tsx | 10 | 0.2 |
| src\types\documents.ts | 10 | 0.2 |
| src\types\notes.ts | 10 | 0.2 |

Total Lines: 13169
Total Size: 385.4KB
