'use client'

import { ProjectWithRelations } from "@/types/projects"
import { TaskList } from "@/components/tasks/task-list"

interface ProjectTasksProps {
  project: ProjectWithRelations
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Project Tasks</h2>
      </div>

      <TaskList projectId={project.id} />
    </div>
  )
}