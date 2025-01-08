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

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  progress: z.number().min(0).max(100).optional(),
  due_date: z.date().optional(),
  start_date: z.date().optional(),
  category: z.string().optional(),
  tax_form_type: z.string().optional(),
  tax_return_id: z.string().optional(),
  template_id: z.string().optional(),
  assignee_id: z.string().optional(),
  assigned_team: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  parent_task_id: z.string().optional()
})

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
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: (task?.status || 'todo') as TaskStatus,
      priority: (task?.priority || 'medium') as TaskPriority,
      progress: task?.progress || 0,
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      start_date: task?.start_date ? new Date(task.start_date) : undefined,
      category: task?.category || undefined,
      tax_form_type: task?.tax_form_type || undefined,
      tax_return_id: task?.tax_return_id || undefined,
      template_id: task?.template_id || undefined,
      assignee_id: task?.assignee_id || undefined,
      assigned_team: task?.assigned_team || undefined,
      dependencies: task?.dependencies || undefined,
      parent_task_id: task?.parent_task_id || undefined
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
        start_date: values.start_date?.toISOString(),
        project_id: projectId,
        category: values.category,
        tax_form_type: values.tax_form_type,
        tax_return_id: values.tax_return_id,
        template_id: values.template_id,
        assignee_id: values.assignee_id,
        assigned_team: values.assigned_team,
        dependencies: values.dependencies,
        parent_task_id: values.parent_task_id,
        updated_at: new Date().toISOString()
      }

      if (task) {
        // Update task
        const { data: updatedTask, error: taskError } = await supabase
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

        if (taskError) throw taskError

        // Add activity log entry
        const activityEntry: ActivityLogEntry = {
          task_id: task.id,
          action: 'updated',
          details: { updates: baseData } as Json
        }

        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert(activityEntry)

        if (activityError) throw activityError

        // Fetch updated task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            activity_log_entries(*)
          `)
          .eq('id', task.id)
          .single()

        if (relationsError) throw relationsError

        toast({
          title: 'Task updated',
          description: 'The task has been successfully updated.'
        })

        if (onTaskUpdate && taskWithRelations) {
          const updatedTaskWithRelations = taskWithRelations as unknown as TaskWithRelationsResponse
          onTaskUpdate({
            ...updatedTaskWithRelations,
            recurring_config: updatedTaskWithRelations.recurring_config as any,
          } as TaskWithRelations)
        }
      } else {
        // Create new task
        const { data: newTask, error: taskError } = await supabase
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

        if (taskError) throw taskError

        // Add initial activity log entry
        const activityEntry: ActivityLogEntry = {
          task_id: newTask.id,
          action: 'created',
          details: { status: newTask.status } as Json
        }

        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert(activityEntry)

        if (activityError) throw activityError

        // Fetch created task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            activity_log_entries(*)
          `)
          .eq('id', newTask.id)
          .single()

        if (relationsError) throw relationsError

        toast({
          title: 'Task created',
          description: 'The task has been successfully created.'
        })

        if (onTaskUpdate && taskWithRelations) {
          const createdTaskWithRelations = taskWithRelations as unknown as TaskWithRelationsResponse
          onTaskUpdate({
            ...createdTaskWithRelations,
            recurring_config: createdTaskWithRelations.recurring_config as any,
          } as TaskWithRelations)
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
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskStatusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskPriorityOptions.map(priority => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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