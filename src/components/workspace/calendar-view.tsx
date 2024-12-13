'use client';

import { useState } from 'react';
import { Task } from '@/types/task-management';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onSelectTask: (task: Task) => void;
  onCreateTask: (date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIME_SLOTS = HOURS.map(hour => `${hour}:00`);

export function CalendarView({ tasks, onUpdateTask, onSelectTask, onCreateTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  
  // Get week dates
  const weekStart = startOfWeek(currentDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleDragStart = (task: Task, e: React.DragEvent) => {
    setDraggingTask(task);
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date, hour: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingTask) return;

    const newDate = new Date(date);
    newDate.setHours(hour);
    
    onUpdateTask(draggingTask.id, {
      dueDate: newDate.toISOString(),
    });
    
    setDraggingTask(null);
  };

  const getTasksForDateAndHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date) && taskDate.getHours() === hour;
    });
  };

  return (
    <div className="h-full flex">
      {/* Tasks List - Left Side */}
      <div className="w-64 border-r flex-shrink-0 flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Tasks</h2>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-2 text-sm bg-muted hover:bg-muted/80 rounded-md cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(task, e)}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar - Right Side */}
      <div className="flex-1 flex flex-col h-full">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = addDays(currentDate, -7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">
              {format(weekDates[0], 'MMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = addDays(currentDate, 7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Select defaultValue="week">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-day">5-day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Time Labels */}
            <div className="w-16 flex-shrink-0 border-r">
              <div className="h-10" /> {/* Header spacer */}
              {TIME_SLOTS.map((time) => (
                <div key={time} className="h-12 border-b text-xs text-muted-foreground p-2">
                  {time}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="flex-1 flex">
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="flex-1 min-w-[120px]">
                  {/* Day Header */}
                  <div className="h-10 border-b text-center sticky top-0 bg-background">
                    <div className="text-sm text-muted-foreground">
                      {format(date, 'EEE')}
                    </div>
                    <div className={cn(
                      "text-sm font-semibold",
                      isSameDay(date, new Date()) && "text-primary"
                    )}>
                      {format(date, 'd')}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {TIME_SLOTS.map((_, hour) => (
                    <div
                      key={hour}
                      className="h-12 border-b border-r relative group"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(date, hour, e)}
                    >
                      <Button
                        variant="ghost"
                        className="h-full w-full opacity-0 group-hover:opacity-100 absolute inset-0"
                        onClick={() => {
                          const newDate = new Date(date);
                          newDate.setHours(hour);
                          onCreateTask(newDate);
                        }}
                      >
                        +
                      </Button>
                      {getTasksForDateAndHour(date, hour).map((task) => (
                        <div
                          key={task.id}
                          className="absolute inset-x-0 m-1 p-1 text-xs bg-primary/10 rounded cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(task, e)}
                          onClick={() => onSelectTask(task)}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
