'use client';

import { useState } from 'react';
import { Task, Status, Priority } from 'src/types/task-management';
import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Textarea } from 'src/components/ui/textarea';
import { Calendar } from 'src/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { formatDate, DATE_FORMATS } from 'src/lib/date-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { TaskActivity } from './task-activity';
import { TimeTracker } from './time-tracker';
import { ScrollArea } from 'src/components/ui/scroll-area';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: Partial<Task>) => void;
  clients?: { id: string; name: string }[];
  initialData?: Partial<Task>;
  workspaceId: string;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  clients = [],
  initialData,
  workspaceId,
}: TaskDialogProps) {
  const [formData, setFormData] = useState<Partial<Task>>(
    initialData || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      workspace_id: workspaceId,
      progress: 0
    }
  );
  const [date, setDate] = useState<Date | undefined>(
    initialData?.due_date ? new Date(initialData.due_date) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      due_date: date?.toISOString(),
    });
    onOpenChange(false);
  };

  const handleAddComment = (taskId: string, comment: string) => {
    // TODO: Implement comment handling
    console.log('Adding comment:', comment);
  };

  const handleTimeEntry = (entry: any) => {
    // TODO: Implement time entry handling
    console.log('Time entry:', entry);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Edit the details of your task below.'
              : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity & Comments</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-1">
            <TabsContent value="details" className="mt-4">
              <form id="task-form" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Name</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter task name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Client</Label>
                      <Select
                        value={formData.client}
                        onValueChange={(value) =>
                          setFormData({ ...formData, client: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={!date ? 'text-muted-foreground' : ''}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? formatDate(date.toISOString(), DATE_FORMATS.FULL) : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value as Status })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value as Priority })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Time Estimate (hours)</Label>
                    <Input
                      type="number"
                      value={formData.time_estimate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, time_estimate: Number(e.target.value) })
                      }
                      placeholder="Enter estimated hours"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter task description"
                    />
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <TaskActivity
                taskId={initialData?.id || ''}
                activities={[
                  {
                    id: '1',
                    type: 'comment',
                    content: 'Started working on this task',
                    user: { name: 'John Doe' },
                    timestamp: new Date().toISOString(),
                  },
                ]}
                onAddComment={handleAddComment}
              />
            </TabsContent>

            <TabsContent value="time" className="mt-4">
              <TimeTracker />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button type="submit" form="task-form">
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
