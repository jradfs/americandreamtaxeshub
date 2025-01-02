'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '../shared/select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '@/lib/validations/project';
import { Tables } from '@/types/database.types';

type Client = Tables<'clients'>;
type ProjectTemplate = Tables<'project_templates'> & {
  tasks: Tables<'template_tasks'>[];
};

interface BasicInfoFormProps {
  form: UseFormReturn<ProjectFormValues>;
  clients: Client[];
  templates?: ProjectTemplate[];
  templatesLoading?: boolean;
}

export function BasicInfoForm({ 
  form, 
  clients,
  templates = [],
  templatesLoading = false 
}: BasicInfoFormProps) {
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.company_name || client.full_name || 'Unnamed Client'
  }));

  const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.name
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Project Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter project name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectField
          form={form}
          name="client_id"
          label="Client"
          options={clientOptions}
          placeholder="Select a client"
        />

        <SelectField
          form={form}
          name="template_id"
          label="Project Template"
          options={templateOptions}
          placeholder={templatesLoading ? "Loading templates..." : "Select a template"}
          description="Select a template to pre-fill project tasks and settings"
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter project description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
