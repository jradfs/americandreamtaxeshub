'use client';

import { Workspace, GroupingType, ViewType } from '@/types/task-management';
import { Search, Calendar, ListFilter, Users, LayoutGrid, CalendarDays, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface WorkspaceHeaderProps {
  workspace: Workspace;
  currentView: ViewType;
  grouping: GroupingType;
  onViewChange: (view: ViewType) => void;
  onGroupingChange: (grouping: GroupingType) => void;
  taskStats?: {
    dueToday: number;
    dueThisWeek: number;
    dueNextWeek: number;
    overdue: number;
  };
}

export function WorkspaceHeader({
  workspace,
  currentView,
  grouping,
  onViewChange,
  onGroupingChange,
  taskStats = {
    dueToday: 0,
    dueThisWeek: 0,
    dueNextWeek: 0,
    overdue: 0,
  },
}: WorkspaceHeaderProps) {
  const VIEW_ICONS = {
    list: <List className="h-4 w-4" />,
    kanban: <LayoutGrid className="h-4 w-4" />,
    calendar: <CalendarDays className="h-4 w-4" />,
  };

  return (
    <div className="border-b bg-background space-y-4 pb-4">
      {/* Task Statistics */}
      <div className="px-6 pt-4 grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Due Today</p>
              <h3 className="text-2xl font-semibold">{taskStats.dueToday}</h3>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Due This Week</p>
              <h3 className="text-2xl font-semibold">{taskStats.dueThisWeek}</h3>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Due Next Week</p>
              <h3 className="text-2xl font-semibold">{taskStats.dueNextWeek}</h3>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h3 className="text-2xl font-semibold text-red-500">{taskStats.overdue}</h3>
            </div>
            <Calendar className="h-4 w-4 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="px-6 space-y-4">
        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={currentView === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>

          <Button variant="default">
            Create New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by project name or work type..."
              className="max-w-md"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="h-4 w-4 mr-2" />
                Tags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked>Tax Return</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Bookkeeping</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Payroll</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Advisory</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Assignee
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Unassigned</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>My Tasks</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Clients
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked>All Clients</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
