'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProjectFormContext } from './ProjectFormContext';
import { ClientSelect } from '@/components/clients/client-select';
import { PrioritySelect } from '@/components/shared/priority-select';
import { useClients } from '@/hooks/useClients';

export function BasicInfoSection() {
  const { form } = useProjectFormContext();
  const { data: clients = [] } = useClients();

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id={field.name}
                placeholder="Enter project name"
                {...field}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id={field.name}
                placeholder="Enter project description"
                {...field}
                value={field.value || ''}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">
                Client
              </label>
              <ClientSelect
                value={field.value}
                onSelect={field.onChange}
                clients={clients}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Priority
              </label>
              <PrioritySelect
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
} 