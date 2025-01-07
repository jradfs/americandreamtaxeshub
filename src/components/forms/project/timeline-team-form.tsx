'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerField } from '../shared/date-picker-field';
import { MultiSelectField } from '../shared/multi-select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { TaskForm } from './task-form';

interface TimelineTeamFormProps {
  form: UseFormReturn<ProjectFormValues>;
  teamMembers: Array<{ id: string; name: string; }>;
}

export function TimelineTeamForm({ form, teamMembers }: TimelineTeamFormProps) {
  const teamMemberOptions = teamMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  const handleAddTask = () => {
    const currentTasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', [
      ...currentTasks,
      {
        title: '',
        description: '',
        priority: 'medium',
        dependencies: [],
        order_index: currentTasks.length
      }
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline & Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            form={form}
            name="due_date"
            label="Due Date"
          />

          <MultiSelectField
            form={form}
            name="team_members"
            label="Team Members"
            options={teamMemberOptions}
            placeholder="Select team members"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Tasks</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </div>

          {form.watch('template_tasks')?.map((_, index) => (
            <TaskForm
              key={index}
              form={form}
              index={index}
              teamMembers={teamMembers}
              onRemove={() => {
                const tasks = form.getValues('template_tasks') || [];
                form.setValue('template_tasks', tasks.filter((_, i) => i !== index));
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
