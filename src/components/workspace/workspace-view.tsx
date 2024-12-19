'use client';

import { useState } from 'react';
import { Task, Status, Priority, Workspace, ViewType, GroupingType } from '@/types/task-management';
import { createTask, updateTask, deleteTask } from '@/app/actions/workspace';
import TaskBoard from './task-board';
import TaskCalendar from './task-calendar';
import KanbanBoard from './kanban-board';
import { CalendarView } from './calendar-view';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { WorkspaceHeader } from './workspace-header';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TaskDialog } from './task-dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDate, isOverdue, DATE_FORMATS } from '@/lib/date-utils';

type TaskFilter = 'all' | 'unplanned' | 'upcoming' | 'recurring';

interface WorkspaceViewProps {
  initialTasks?: Task[];
  workspace?: Workspace;
  projects?: any[];
}

const defaultWorkspace: Workspace = {
  id: 'default',
  name: 'My Workspace',
  projects: [],
  tasks: [],
  settings: {
    default_view: 'list',
    default_grouping: 'Status',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const WorkspaceView = ({ 
  initialTasks = [], 
  workspace = defaultWorkspace,
  projects = []
}: WorkspaceViewProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewType>(workspace.settings.default_view);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await createTask(workspace.id, {
        ...taskData,
        workspace_id: workspace.id,
      });
      setTasks([...tasks, newTask]);
      setTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistically update the UI
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      ));

      // Make the API call
      const updatedTask = await updateTask(taskId, updates);
      
      // Update with the server response
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? updatedTask 
          : task
      ));
    } catch (error) {
      // Revert on error
      console.error('Error updating task:', error);
      // Restore the original tasks state
      setTasks([...tasks]);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTaskStats = () => {
    const today = new Date();
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() + 7);
    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7);

    return {
      dueToday: tasks.filter(task => task.due_date && formatDate(task.due_date, DATE_FORMATS.ISO) === formatDate(today.toISOString(), DATE_FORMATS.ISO)).length,
      dueThisWeek: tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate > today && dueDate <= thisWeek;
      }).length,
      dueNextWeek: tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate > thisWeek && dueDate <= nextWeek;
      }).length,
      overdue: tasks.filter(task => task.due_date && isOverdue(task.due_date)).length,
    };
  };

  const renderListView = () => (
    <div className="px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-[300px]">Progress</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group">
              <TableCell>
                <Checkbox 
                  checked={task.status === 'done'}
                  onCheckedChange={(checked) => {
                    handleUpdateTask(task.id, { status: checked ? 'done' : 'in_progress' })
                  }}
                />
              </TableCell>
              <TableCell>{task.client || 'Unassigned'}</TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="space-y-1">
                      <div className="font-medium">{task.title}</div>
                      <Badge variant={getStatusVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center pt-2">
                        <span className="text-xs text-muted-foreground">
                          Created {formatDate(task.created_at, DATE_FORMATS.FULL)}
                        </span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Progress 
                    value={task.progress || 0} 
                    className={cn(
                      "h-2",
                      task.status === 'done' ? "bg-green-100" : "",
                      isOverdue(task.due_date) ? "bg-red-100" : ""
                    )}
                  />
                  <div className="text-xs text-muted-foreground">
                    {task.progress || 0}% Complete
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    isOverdue(task.due_date) ? 'text-red-500' : '',
                    'whitespace-nowrap'
                  )}>
                    {formatDate(task.due_date, DATE_FORMATS.FULL)}
                  </div>
                  {isOverdue(task.due_date) && (
                    <HoverCard>
                      <HoverCardTrigger>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <span className="text-sm text-red-500">
                          This task is overdue
                        </span>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {task.assigned_user_id ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{task.assigned_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                      <div className="flex justify-between space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{task.assigned_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Assigned User</h4>
                          <p className="text-sm text-muted-foreground">
                            Team Member
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <Badge variant="outline">Unassigned</Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>Assign</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const getStatusVariant = (status: Status) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader
        workspace={workspace}
        currentView={view}
        grouping={workspace.settings.default_grouping}
        onViewChange={setView}
        onGroupingChange={() => {}}
        taskStats={getTaskStats()}
      />
      
      <div className="flex-1 overflow-auto">
        {view === 'list' && renderListView()}
        {view === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onEditTask={handleEditTask}
          />
        )}
        {view === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onSelectTask={handleEditTask}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
          />
        )}
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={selectedTask ? 
          (data) => handleUpdateTask(selectedTask.id, data) : 
          handleCreateTask
        }
        initialData={selectedTask || undefined}
        clients={[
          { id: '1', name: 'Client A' },
          { id: '2', name: 'Client B' },
        ]}
        workspaceId={workspace.id}
      />
    </div>
  );
};

export default WorkspaceView;
