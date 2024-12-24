'use client'

import { Task, GroupingType } from '@/types/workspace'
import { TaskRow } from '../task-row'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGroupTasks } from '@/hooks/workspace/use-group-tasks'

interface ListViewProps {
  tasks: Task[]
  grouping: GroupingType
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>
}

export function ListView({
  tasks,
  grouping,
  onEditTask,
  onDeleteTask,
  onUpdateTask
}: ListViewProps) {
  const groupedTasks = useGroupTasks(tasks, grouping)

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {Object.entries(groupedTasks).map(([group, groupTasks]) => (
          <div key={group} className="mb-8">
            <h3 className="mb-4 text-lg font-semibold">
              {group}
              <span className="ml-2 text-muted-foreground">
                ({groupTasks.length})
              </span>
            </h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]" />
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="w-[300px]">Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task.id)}
                    onUpdate={(updates) => onUpdateTask(task.id, updates)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}