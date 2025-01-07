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