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