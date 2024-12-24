'use client'

import { useWorkspace } from '@/hooks/workspace/use-workspace'
import { ListView } from './views/list-view'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WorkspaceViewProps {
  workspaceId: string
}

export function WorkspaceView({ workspaceId }: WorkspaceViewProps) {
  const {
    tasks,
    view,
    grouping,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  } = useWorkspace(workspaceId)

  if (loading) {
    return <div className="flex-1 p-8">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      {view === 'list' && (
        <ListView
          tasks={tasks}
          grouping={grouping}
          onEditTask={(task) => {
            // Will be connected to task dialog later
            console.log('Edit task:', task)
          }}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
      )}
      
      {view === 'kanban' && (
        <div className="p-8">Kanban view coming soon...</div>
      )}
      
      {view === 'calendar' && (
        <div className="p-8">Calendar view coming soon...</div>
      )}
    </div>
  )
}