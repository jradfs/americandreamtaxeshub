'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { ViewSelector } from './view-selector'
import { useWorkspace } from '@/hooks/workspace/use-workspace'

export function WorkspaceHeader() {
  const {
    view,
    grouping,
    setView,
    setGrouping,
    createTask
  } = useWorkspace('default') // Using default workspace for now

  const handleNewTask = () => {
    // This will be connected to a task dialog later
    createTask({
      title: 'New Task',
      status: 'todo',
      priority: 'medium'
    })
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Workspace</h1>
        </div>

        <ViewSelector
          currentView={view}
          currentGrouping={grouping}
          onViewChange={setView}
          onGroupingChange={setGrouping}
        />

        <Button onClick={handleNewTask}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>
  )
}