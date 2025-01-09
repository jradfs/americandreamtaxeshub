'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { useTasks } from '@/hooks/useTasks'
import { toast } from '@/components/ui/use-toast'
import type { TaskWithRelations, TaskFormData } from '@/types/tasks'
import { TaskErrorBoundary } from '@/components/tasks/task-error-boundary'
import { Skeleton } from '@/components/ui/skeleton'

export default function TasksPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const { 
    tasks, 
    isLoading, 
    error,
    createTask, 
    updateTask, 
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting
  } = useTasks()

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data)
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!selectedTask?.id) return

    try {
      await updateTask({ id: selectedTask.id, ...data })
      setSelectedTask(null)
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      })
    }
  }

  if (error) {
    return (
      <div className="container py-6">
        <TaskErrorBoundary>
          <div>Error loading tasks: {error.message}</div>
        </TaskErrorBoundary>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <TaskErrorBoundary>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <Button 
            onClick={() => {
              setSelectedTask(null)
              setIsDialogOpen(true)
            }}
            disabled={isCreating}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedTask(task)
                setIsDialogOpen(true)
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTask(task.id)
                  }}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <TaskDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          taskData={selectedTask}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          isSubmitting={selectedTask ? isUpdating : isCreating}
        />
      </div>
    </TaskErrorBoundary>
  )
}