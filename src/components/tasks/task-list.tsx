'use client'

import { DbTask, TaskFormValues } from '@/types/tasks'
import { TaskItem } from './task-item'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface TaskListProps {
  tasks: DbTask[]
  isLoading?: boolean
  onUpdate?: (task: DbTask) => void
  onDelete?: (taskId: string) => void
  onReorder?: (tasks: DbTask[]) => void
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

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onReorder) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable 
                key={task.id} 
                draggableId={task.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem 
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}