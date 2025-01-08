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
  DbChecklistItem,
  DbActivityLogEntry
} from '@/types/tasks'
import { Database } from '@/types/database.types'
import type { RecurringConfig } from '@/types/tasks'
import { User } from '@/types/users'

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  progress: z.number().min(0).max(100).optional(),
  due_date: z.date().optional(),
  checklist_items: z.array(z.object({
    text: z.string(),
    completed: z.boolean()
  })).optional()
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
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      checklist_items: task?.checklist_items?.map(item => ({
        text: item.text,
        completed: item.completed
      })) || []
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

        // Update checklist items
        if (values.checklist_items) {
          // Delete existing items
          await supabase
            .from('checklist_items')
            .delete()
            .eq('task_id', task.id)

          // Insert new items
          if (values.checklist_items.length > 0) {
            const { error: checklistError } = await supabase
              .from('checklist_items')
              .insert(
                values.checklist_items.map(item => ({
                  task_id: task.id,
                  text: item.text,
                  completed: item.completed
                }))
              )

            if (checklistError) throw checklistError
          }
        }

        // Add activity log entry
        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert({
            task_id: task.id,
            type: 'updated',
            details: { updates: baseData }
          })

        if (activityError) throw activityError

        // Fetch updated task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            checklist_items(*),
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
          onTaskUpdate(taskWithRelations as TaskWithRelations)
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

        // Add checklist items if provided
        if (values.checklist_items?.length) {
          const { error: checklistError } = await supabase
            .from('checklist_items')
            .insert(
              values.checklist_items.map(item => ({
                task_id: newTask.id,
                text: item.text,
                completed: item.completed
              }))
            )

          if (checklistError) throw checklistError
        }

        // Add initial activity log entry
        const { error: activityError } = await supabase
          .from('activity_log_entries')
          .insert({
            task_id: newTask.id,
            type: 'created',
            details: { status: newTask.status }
          })

        if (activityError) throw activityError

        // Fetch created task with relations
        const { data: taskWithRelations, error: relationsError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:users(id, email, full_name, role),
            project:projects(id, name),
            parent_task:tasks(id, title),
            checklist_items(*),
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
          onTaskUpdate(taskWithRelations as TaskWithRelations)
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

        <Form {...form}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskStatusOptions.map(status => (
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
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskPriorityOptions.map(priority => (
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

            <FormField
              control={form.control}
              name="checklist_items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checklist Items</FormLabel>
                  <div className="space-y-2">
                    {field.value?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...(field.value || [])]
                            newItems[index] = { ...newItems[index], text: e.target.value }
                            field.onChange(newItems)
                          }}
                          placeholder="Checklist item"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newItems = field.value?.filter((_, i) => i !== index)
                            field.onChange(newItems)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([...(field.value || []), { text: '', completed: false }])
                      }}
                    >
                      Add Item
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : task ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}