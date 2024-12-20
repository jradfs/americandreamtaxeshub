'use client';

import { useState } from 'react';
import { Task, Status, Priority, Workspace, ViewType, GroupingType } from 'src/types/task-management';
import { createTask, updateTask, deleteTask } from 'src/app/actions/workspace';
import { useClients } from 'src/hooks/useClients';
import TaskBoard from './task-board';
import TaskCalendar from './task-calendar';
import KanbanBoard from './kanban-board';
import { CalendarView } from './calendar-view';
import { Button } from 'src/components/ui/button';
import { Plus, MoreHorizontal, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table';
import { TaskRow } from './task-row';
import { useProjects } from 'src/hooks/useProjects';
import { Checkbox } from 'src/components/ui/checkbox';
import { Badge } from 'src/components/ui/badge';
import { WorkspaceHeader } from './workspace-header';
import { Progress } from 'src/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { TaskDialog } from './task-dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from 'src/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { cn } from 'src/lib/utils';
import { formatDate, isOverdue, DATE_FORMATS } from 'src/lib/date-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';

type TaskFilter = 'all' | 'unplanned' | 'upcoming' | 'recurring';

interface WorkspaceViewProps {
  initialTasks?: Task[];
  workspace?: Workspace;
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
}: WorkspaceViewProps) => {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewType>(workspace.settings.default_view);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [grouping, setGrouping] = useState<GroupingType>(workspace.settings.default_grouping);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { clients, loading: clientsLoading, error: clientsError } = useClients();
  const formattedClients = clients?.map(client => ({
    id: client.id,
    name: client.full_name || client.company_name,
  })) || [];
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [clientFilter, setClientFilter] = useState<string[]>([]);

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    if (filter === 'unplanned') {
      filteredTasks = filteredTasks.filter(task => !task.due_date);
    } else if (filter === 'upcoming') {
      filteredTasks = filteredTasks.filter(task => task.due_date);
    }
    
    if (tagFilter.length > 0) {
      filteredTasks = filteredTasks.filter(task => task.tags?.some(tag => tagFilter.includes(tag)));
    }

    if (assigneeFilter.length > 0) {
      filteredTasks = filteredTasks.filter(task => assigneeFilter.includes(task.assignee_id));
    }

    if (clientFilter.length > 0) {
        filteredTasks = filteredTasks.filter(task => clientFilter.includes(task.client_id));
    }

    return filteredTasks;
  };

  const getGroupedTasks = () => {
    const filteredTasks = getFilteredTasks();
    if (grouping === 'Status') {
      return filteredTasks.reduce((acc, task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
      }, {} as Record<Status, Task[]>);
    } else if (grouping === 'Priority') {
        return filteredTasks.reduce((acc, task) => {
          acc[task.priority] = acc[task.priority] || [];
          acc[task.priority].push(task);
          return acc;
        }, {} as Record<Priority, Task[]>);
    } else if (grouping === 'Task') {
      return filteredTasks.reduce((acc, task) => {
        acc[task.id] = [task];
        return acc;
      }, {} as Record<string, Task[]>);
    } else if (grouping === 'Stage') {
      return filteredTasks.reduce((acc, task) => {
        acc[task.stage] = acc[task.stage] || [];
        acc[task.stage].push(task);
        return acc;
      }, {} as Record<string, Task[]>);
    } else if (grouping === 'Priority') {
      return filteredTasks.reduce((acc, task) => {
        acc[task.priority] = acc[task.priority] || [];
        acc[task.priority].push(task);
        return acc;
      }, {} as Record<Priority, Task[]>);
    }
     else {
      return { 'all': filteredTasks };
    }
  };

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
      const updatedTask = await updateTask(taskId, updates);
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

    let dueToday = 0;
    let dueThisWeek = 0;
    let dueNextWeek = 0;
    let overdue = 0;

    tasks.forEach(task => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        if (formatDate(task.due_date, DATE_FORMATS.ISO) === formatDate(today.toISOString(), DATE_FORMATS.ISO)) {
          dueToday++;
        } else if (dueDate > today && dueDate <= thisWeek) {
          dueThisWeek++;
        } else if (dueDate > thisWeek && dueDate <= nextWeek) {
          dueNextWeek++;
        }
        if (isOverdue(task.due_date)) {
          overdue++;
        }
      }
    });

    return {
      dueToday,
      dueThisWeek,
      dueNextWeek,
      overdue,
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
          {Object.values(getGroupedTasks()).flat().map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onUpdateTask={handleUpdateTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
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
        onViewChange={setView}
        onGroupingChange={() => {}}
        taskStats={getTaskStats()}
      />
      
      <div className="flex-1 overflow-auto">
        {view === 'list' && renderListView()}
        {view === 'kanban' && (
          <KanbanBoard
            tasks={getGroupedTasks()}
            onUpdateTask={handleUpdateTask}
            onEditTask={handleEditTask}
          />
        )}
        {view === 'calendar' && (
          <CalendarView
            tasks={getGroupedTasks()}
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
        clients={formattedClients}
        workspaceId={workspace.id}
      />
    </div>
  );
};

export default WorkspaceView;
