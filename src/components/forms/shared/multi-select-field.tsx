'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  description?: string;
}

export function MultiSelectField({
  form,
  name,
  label,
  options,
  placeholder = "Select options",
  description
}: MultiSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            selected={field.value || []}
            options={options}
            onChange={field.onChange}
            placeholder={placeholder}
          />
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
