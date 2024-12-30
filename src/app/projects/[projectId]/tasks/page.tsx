'use client'

import { TaskList } from 'src/components/tasks/task-list'

export default function ProjectTasksPage({
  params
}: {
  params: { projectId: string }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Project Tasks</h1>
      <TaskList projectId={params.projectId} />
    </div>
  )
}
