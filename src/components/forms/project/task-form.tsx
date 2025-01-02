'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '../shared/select-field';
import { MultiSelectField } from '../shared/multi-select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';

interface TaskFormProps {
  form: UseFormReturn<ProjectFormValues>;
  index: number;
  teamMembers: Array<{ id: string; name: string; }>;
  onRemove: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export function TaskForm({ form, index, teamMembers, onRemove }: TaskFormProps) {
  const teamMemberOptions = teamMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  const dependencyOptions = form.getValues('tasks')
    ?.filter((_, i) => i !== index)
    .map(task => ({
      value: task.title,
      label: task.title
    })) || [];

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Task {index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`tasks.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Task title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectField
          form={form}
          name={`tasks.${index}.priority`}
          label="Priority"
          options={PRIORITY_OPTIONS}
          placeholder="Select priority"
          defaultValue="medium"
        />
      </div>

      <FormField
        control={form.control}
        name={`tasks.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Task description"
                className="min-h-[60px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          form={form}
          name={`tasks.${index}.assigned_to`}
          label="Assigned To"
          options={teamMemberOptions}
          placeholder="Select team member"
        />

        <MultiSelectField
          form={form}
          name={`tasks.${index}.dependencies`}
          label="Dependencies"
          options={dependencyOptions}
          placeholder="Select dependent tasks"
        />
      </div>
    </div>
  );
}
