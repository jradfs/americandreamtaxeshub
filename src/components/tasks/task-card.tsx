'use client';

import { TaskWithRelations } from '@/types/tasks'

interface TaskCardProps {
  task: TaskWithRelations
  onEdit: (task: TaskWithRelations) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium">{task.title}</h3>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{task.status}</span>
          {task.priority && <span className="text-sm text-gray-500">{task.priority}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}
