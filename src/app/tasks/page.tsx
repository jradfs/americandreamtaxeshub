'use client'

import { TaskList } from 'src/components/tasks/task-list'

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">All Tasks</h1>
      <TaskList />
    </div>
  )
}
