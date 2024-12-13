'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  taskType: string;
  estimatedDuration: number;
  defaultPriority: string;
  defaultAssigneeRole: string;
  subtasks: string[];
  autoAssign: boolean;
  notifyOnCreation: boolean;
}

interface TaskTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (template: Partial<TaskTemplate>) => void;
  initialData?: Partial<TaskTemplate>;
}

export function TaskTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: TaskTemplateDialogProps) {
  const [formData, setFormData] = useState<Partial<TaskTemplate>>(
    initialData || {
      name: '',
      description: '',
      taskType: 'tax_return',
      estimatedDuration: 60,
      defaultPriority: 'medium',
      defaultAssigneeRole: 'tax_preparer',
      subtasks: [],
      autoAssign: true,
      notifyOnCreation: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Template' : 'Create Task Template'}</DialogTitle>
            <DialogDescription>
              Create a template for recurring tasks to automate your workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Monthly Bookkeeping"
              />
            </div>

            <div className="grid gap-2">
              <Label>Task Type</Label>
              <Select
                value={formData.taskType}
                onValueChange={(value) =>
                  setFormData({ ...formData, taskType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_return">Tax Return</SelectItem>
                  <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="advisory">Advisory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Default Priority</Label>
              <Select
                value={formData.defaultPriority}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultPriority: value })
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

            <div className="grid gap-2">
              <Label>Default Assignee Role</Label>
              <Select
                value={formData.defaultAssigneeRole}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultAssigneeRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_preparer">Tax Preparer</SelectItem>
                  <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })
                }
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Template Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the template and any special instructions..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoAssign"
                checked={formData.autoAssign}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoAssign: checked })
                }
              />
              <Label htmlFor="autoAssign">Auto-assign to available team member</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notifyOnCreation"
                checked={formData.notifyOnCreation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, notifyOnCreation: checked })
                }
              />
              <Label htmlFor="notifyOnCreation">Notify team on task creation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {initialData ? 'Save Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
