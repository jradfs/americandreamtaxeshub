'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  Search, 
  X,
  ArrowUpDown,
} from "lucide-react";
import { ProjectFilters as ProjectFiltersType, defaultFilters } from "@/hooks/useProjectFilters";
import { Badge } from "@/components/ui/badge";

interface ProjectFiltersProps {
  filters: ProjectFiltersType;
  onChange: (filters: ProjectFiltersType) => void;
  clientOptions?: Array<{ id: string; label: string }>;
}

export function ProjectFilters({ filters, onChange, clientOptions = [] }: ProjectFiltersProps) {
  const [date, setDate] = useState<DateRange | undefined>(filters.dateRange);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange({
      ...filters,
      dateRange: range,
    });
  };

  const clearFilters = () => {
    setDate(undefined);
    onChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.search !== "" || 
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.stage !== "all" ||
    filters.clientId !== "all" ||
    filters.dateRange !== undefined;

  const toggleSortOrder = () => {
    onChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, clients..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => onChange({ ...filters, search: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Main Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => onChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={filters.priority}
            onValueChange={(value) => onChange({ ...filters, priority: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Stage Filter */}
          <Select
            value={filters.stage}
            onValueChange={(value) => onChange({ ...filters, stage: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="preparation">Preparation</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="filing">Filing</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Filter */}
          {clientOptions.length > 0 && (
            <Select
              value={filters.clientId}
              onValueChange={(value) => onChange({ ...filters, clientId: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Secondary Row - Date and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Sort Options */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time</SelectLabel>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="due">Due Date</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Properties</SelectLabel>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="estimatedHours">Estimated Hours</SelectItem>
                <SelectItem value="completedTasks">Completion</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Sort Direction Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className={cn(
              "h-10 w-10",
              filters.sortOrder === 'desc' && "bg-muted"
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}