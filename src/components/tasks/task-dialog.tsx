'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskFormData, taskSchema, TaskWithRelations } from '@/types/tasks'
import { taskStatusOptions, taskPriorityOptions } from '@/lib/constants'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => Promise<void>
  taskData?: TaskWithRelations
  projectId?: string
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  taskData,
  projectId
}: TaskDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      project_id: projectId || null,
      assignee_id: null
    }
  })

  useEffect(() => {
    if (taskData) {
      form.reset({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority || 'medium',
        project_id: taskData.project_id,
        assignee_id: taskData.assignee_id
      })
    } else {
      form.reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project_id: projectId || null,
        assignee_id: null
      })
    }
  }, [taskData, projectId, form])

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error will be handled by the error boundary
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskData ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            aria-label={taskData ? 'Edit task form' : 'Create task form'}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task title"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.title}
                      aria-describedby={form.formState.errors.title ? 'title-error' : undefined}
                    />
                  </FormControl>
                  <FormMessage id="title-error" role="alert" />
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
                    <Textarea
                      {...field}
                      placeholder="Enter task description"
                      aria-invalid={!!form.formState.errors.description}
                      aria-describedby={form.formState.errors.description ? 'description-error' : undefined}
                    />
                  </FormControl>
                  <FormMessage id="description-error" role="alert" />
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={!!form.formState.errors.status}
                      aria-describedby={form.formState.errors.status ? 'status-error' : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskStatusOptions.map((status) => (
                          <SelectItem 
                            key={status.value} 
                            value={status.value}
                            aria-label={status.label}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id="status-error" role="alert" />
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
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={!!form.formState.errors.priority}
                      aria-describedby={form.formState.errors.priority ? 'priority-error' : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskPriorityOptions.map((priority) => (
                          <SelectItem 
                            key={priority.value} 
                            value={priority.value}
                            aria-label={priority.label}
                          >
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id="priority-error" role="alert" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                aria-disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : taskData ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}