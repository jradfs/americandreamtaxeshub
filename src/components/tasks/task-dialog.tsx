'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/types/database.types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TaskWithRelations } from '@/types/tasks'

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
type DbChecklistItem = Database['public']['Tables']['checklist_items']['Row']

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: TaskWithRelations | null
  onSubmit: (data: DbTaskInsert) => Promise<void>
}

const STATUS_OPTIONS = ['todo', 'in_progress', 'review', 'completed'] as const
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'] as const

export function TaskDialog({ open, onOpenChange, task, onSubmit }: TaskDialogProps) {
  const form = useForm<DbTaskInsert>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      assignee_id: task?.assignee_id || null,
      category: task?.category || null,
      due_date: task?.due_date || null,
      parent_task_id: task?.parent_task_id || null,
      project_id: task?.project_id || null,
      template_id: task?.template_id || null
    }
  })

  const handleSubmit = async (data: DbTaskInsert) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit task:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
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
                      {STATUS_OPTIONS.map(status => (
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
                      {PRIORITY_OPTIONS.map(priority => (
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {task ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}