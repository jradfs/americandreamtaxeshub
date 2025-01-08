'use client'

import { ProjectWithRelations } from "@/types/projects"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskList } from "@/components/tasks/task-list"
import { useTasks } from "@/hooks/useTasks"
import { TaskFormSchema } from "@/lib/validations/task"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface ProjectTasksProps {
  project: ProjectWithRelations
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { tasks, isLoading, error, mutate } = useTasks(project.id)

  const handleCreateTask = async (data: TaskFormSchema) => {
    // Handle task creation
    console.log('Create task:', data)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onTaskUpdate={mutate}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        defaultValues={{
          project_id: project.id,
          status: 'todo',
        }}
      />
    </div>
  )
}