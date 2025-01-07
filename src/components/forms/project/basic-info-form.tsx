'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  // Group clients by type and create appropriate labels
  const clientOptions = clients
    .sort((a, b) => {
      // Sort by type first, then by name
      if (a.type !== b.type) {
        return a.type === 'business' ? -1 : 1;
      }
      // For businesses, sort by company name
      if (a.type === 'business') {
        return (a.company_name || '').localeCompare(b.company_name || '');
      }
      // For individuals, sort by full name
      return (a.full_name || '').localeCompare(b.full_name || '');
    })
    .map(client => ({
      value: client.id,
      label: client.type === 'business' 
        ? `${client.company_name || 'Unnamed Business'}`
        : `${client.full_name || 'Unnamed Individual'}`,
      group: client.type === 'business' ? 'Business Clients' : 'Individual Clients'
    }));

  const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.title
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

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Business Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Business Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Individual Clients</SelectLabel>
                      {clientOptions
                        .filter(option => option.group === 'Individual Clients')
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Template</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  value={value || ''}
                  onChange={onChange}
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
