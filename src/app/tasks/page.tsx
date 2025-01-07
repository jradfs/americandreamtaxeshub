'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { useTasks } from '@/hooks/useTasks'
import { DbTask, TaskFormValues, DbTaskUpdate } from '@/types/tasks'
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/types/database.types'

export default function TasksPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DbTask | null>(null)
  const { tasks, createTask, updateTask, deleteTask } = useTasks()

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      await createTask(data)
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      })
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateTask = async (data: TaskFormValues) => {
    if (!selectedTask) return

    try {
      await updateTask(selectedTask.id, data as DbTaskUpdate)
      setSelectedTask(null)
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      })
    } catch (error) {
      console.error('Error updating task:', error)
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
      setSelectedTask(null)
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      <div className="mt-8 grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedTask(task)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <TaskDialog
        open={isDialogOpen || !!selectedTask}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setSelectedTask(null)
        }}
        task={selectedTask}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  )
}