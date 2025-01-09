'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskDialog } from './task-dialog'
import { TaskItem } from './task-item'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import { ErrorBoundary } from '@/components/error-boundary'

interface TaskContainerProps {
  projectId?: string
}

export function TaskContainer({ projectId }: TaskContainerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetails, setShowDetails] = useState(false)

  const {
    tasks,
    totalTasks,
    totalPages,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    prefetchNextPage
  } = useTasks({
    projectId,
    page: currentPage,
    includeRelations: showDetails
  })

  if (error) {
    throw error
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleShowDetailsToggle = () => {
    setShowDetails(!showDetails)
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Task
            </Button>
            <Button
              variant="outline"
              onClick={handleShowDetailsToggle}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          {(isCreating || isUpdating || isDeleting) && (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-muted-foreground">
                {isCreating && 'Creating task...'}
                {isUpdating && 'Updating task...'}
                {isDeleting && 'Deleting task...'}
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  showDetails={showDetails}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onNextPage={prefetchNextPage}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No tasks found. Create one to get started.
          </div>
        )}

        <TaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={createTask}
          projectId={projectId}
        />
      </div>
    </ErrorBoundary>
  )
} 