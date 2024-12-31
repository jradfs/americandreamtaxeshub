'use client'

import { TaskList } from '@/components/tasks/task-list'
import { Toaster } from '@/components/ui/toaster'

export default function TasksPage() {
  return (
    <div className="container py-10">
      <TaskList />
      <Toaster />
    </div>
  )
}