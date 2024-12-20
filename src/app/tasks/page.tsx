'use client'

import { TaskList } from 'src/components/tasks/task-list.tsx';
import { Toaster } from 'src/components/ui/toaster.tsx';

export default function TasksPage() {
  return (
    <div className="container py-10">
      <TaskList />
      <Toaster />
    </div>
  )
}
