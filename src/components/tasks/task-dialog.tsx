'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskWithRelations, TaskFormData, taskSchema, TASK_STATUS, TASK_PRIORITY } from '@/types/tasks'
import { ErrorBoundary } from '@/components/error-boundary'
import { useToast } from '@/components/ui/use-toast'

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
  isSubmitting = false
}: TaskDialogProps) {
  const { toast } = useToast()
  const [error, setError] = useState<Error | null>(null)

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskData?.title || '',
      description: taskData?.description || '',
      status: taskData?.status || TASK_STATUS.TODO,
      priority: taskData?.priority || TASK_PRIORITY.MEDIUM,
      project_id: taskData?.project_id || null,
      assignee_id: taskData?.assignee_id || null,
      due_date: taskData?.due_date || null,
      start_date: taskData?.start_date || null,
      tax_form_type: taskData?.tax_form_type || null,
      category: taskData?.category || null
    }
  })

  const handleSubmit = async (data: TaskFormData) => {
    try {
      setError(null)
      await onSubmit(data)
      setIsOpen(false)
      form.reset()
      toast({
        title: `Task ${taskData ? 'updated' : 'created'} successfully`,
        variant: 'default'
      })
    } catch (err) {
      setError(err as Error)
      toast({
        title: 'Error',
        description: (err as Error).message || `Failed to ${taskData ? 'update' : 'create'} task`,
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <ErrorBoundary>
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
                        {Object.entries(TASK_STATUS).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.replace(/_/g, ' ')}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive">
                  {error.message}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : taskData ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}