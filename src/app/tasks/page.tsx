'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { useTasks } from '@/hooks/useTasks'
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/types/database.types'

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']

export default function TasksPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DbTaskInsert | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { tasks, createTask, updateTask, deleteTask } = useTasks()

  const handleCreateTask = async (data: DbTaskInsert) => {
    try {
      await createTask({
        ...data,
        title: data.title || '',
        status: data.status || 'todo',
        activity_log: data.activity_log || null,
        checklist: data.checklist || null,
        assigned_team: data.assigned_team || null,
        assignee_id: data.assignee_id || null,
        category: data.category || null,
        created_at: data.created_at || null,
        dependencies: data.dependencies || null,
        description: data.description || null,
        due_date: data.due_date || null,
        parent_task_id: data.parent_task_id || null,
        priority: data.priority || 'medium',
        progress: data.progress || null,
        project_id: data.project_id || null,
        recurring_config: data.recurring_config || null,
        start_date: data.start_date || null,
        tax_form_type: data.tax_form_type || null,
        tax_return_id: data.tax_return_id || null,
        template_id: data.template_id || null,
        updated_at: data.updated_at || null
      })
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

  const handleUpdateTask = async (data: DbTaskInsert) => {
    if (selectedIndex === null) return

    try {
      await updateTask(selectedIndex, {
        ...data,
        title: data.title || '',
        status: data.status || 'todo',
        activity_log: data.activity_log || null,
        checklist: data.checklist || null,
        assigned_team: data.assigned_team || null,
        assignee_id: data.assignee_id || null,
        category: data.category || null,
        created_at: data.created_at || null,
        dependencies: data.dependencies || null,
        description: data.description || null,
        due_date: data.due_date || null,
        parent_task_id: data.parent_task_id || null,
        priority: data.priority || 'medium',
        progress: data.progress || null,
        project_id: data.project_id || null,
        recurring_config: data.recurring_config || null,
        start_date: data.start_date || null,
        tax_form_type: data.tax_form_type || null,
        tax_return_id: data.tax_return_id || null,
        template_id: data.template_id || null,
        updated_at: data.updated_at || null
      })
      setSelectedTask(null)
      setSelectedIndex(null)
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

  const handleDeleteTask = async (index: number) => {
    try {
      await deleteTask(index)
      setSelectedTask(null)
      setSelectedIndex(null)
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
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTask(task)
                  setSelectedIndex(index)
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTask(index)}
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
          if (!open) {
            setSelectedTask(null)
            setSelectedIndex(null)
          }
        }}
        task={selectedTask}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  )
}