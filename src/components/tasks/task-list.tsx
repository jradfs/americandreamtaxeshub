'use client'

import type { Database } from '@/types/database.types'

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskListProps {
  tasks: DbTaskInsert[]
  isLoading?: boolean
  onUpdate?: (task: DbTaskInsert, index: number) => void
  onDelete?: (index: number) => void
  onReorder?: (tasks: DbTaskInsert[]) => void
}

export function TaskList({ 
  tasks, 
  isLoading = false,
  onUpdate,
  onDelete,
  onReorder 
}: TaskListProps) {
  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (!tasks.length) {
    return <div>No tasks found</div>
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
            </div>
            <div className="flex gap-2">
              {onUpdate && (
                <button onClick={() => onUpdate(task, index)} className="text-blue-500">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(index)} className="text-red-500">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}