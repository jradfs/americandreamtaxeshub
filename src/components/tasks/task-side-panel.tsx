'use client'

import { useState, useEffect } from 'react'
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
  taskPriorityOptions
} from '@/types/tasks'
import { Database } from '@/types/database.types'

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.custom<Database['public']['Enums']['task_status']>(),
  priority: z.custom<Database['public']['Enums']['task_priority']>(),
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
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      progress: task?.progress || 0,
      due_date: task?.due_date ? new Date(task.due_date) : undefined
    }
  })

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    setLoading(true)
    try {
      const updateData = {
        ...values,
        project_id: projectId,
        client_id: clientId,
        updated_at: new Date().toISOString()
      }

      if (task) {
        const { data: updatedTask, error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', task.id)
          .select('*')
          .single()

        if (error) throw error

        toast({
          title: 'Task updated',
          description: 'The task has been successfully updated.'
        })

        if (onTaskUpdate && updatedTask) {
          onTaskUpdate(updatedTask as TaskWithRelations)
        }
      } else {
        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert({
            ...updateData,
            created_at: new Date().toISOString()
          })
          .select('*')
          .single()

        if (error) throw error

        toast({
          title: 'Task created',
          description: 'The task has been successfully created.'
        })

        if (onTaskUpdate && newTask) {
          onTaskUpdate(newTask as TaskWithRelations)
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
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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