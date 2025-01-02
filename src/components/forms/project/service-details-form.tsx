'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectField } from '../shared/select-field';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues, ServiceType } from '@/lib/validations/project';
import { Tables } from '@/types/database.types';

interface ServiceDetailsFormProps {
  form: UseFormReturn<ProjectFormValues>;
  taxReturns?: Tables<'tax_returns'>[];
  loading?: boolean;
}

const SERVICE_OPTIONS = [
  { value: 'tax_returns', label: 'Tax Returns' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'business_services', label: 'Business Services' },
  { value: 'irs_representation', label: 'IRS Representation' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'uncategorized', label: 'Uncategorized' }
] as const;

const TAX_RETURN_STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review_needed', label: 'Review Needed' },
  { value: 'completed', label: 'Completed' }
] as const;

export function ServiceDetailsForm({ form, taxReturns = [], loading = false }: ServiceDetailsFormProps) {
  const watchedServiceType = form.watch('service_type') as ServiceType;
  const watchedClientId = form.watch('client_id');

  const clientTaxReturns = taxReturns.filter(tr => tr.client_id === watchedClientId);
  const taxReturnOptions = clientTaxReturns.map(tr => ({
    value: tr.id,
    label: `${tr.tax_year} - ${tr.return_type}`
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectField
          form={form}
          name="service_type"
          label="Service Type"
          options={SERVICE_OPTIONS}
          placeholder="Select service type"
        />

        {watchedServiceType === 'tax_returns' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tax Return Details</h3>
            <SelectField
              form={form}
              name="tax_return_id"
              label="Tax Return"
              options={taxReturnOptions}
              placeholder={loading ? "Loading tax returns..." : "Select tax return"}
              description="Select the tax return this project is for"
            />
            <SelectField
              form={form}
              name="tax_return_status"
              label="Initial Status"
              options={TAX_RETURN_STATUS_OPTIONS}
              placeholder="Select initial status"
              defaultValue="not_started"
            />
          </div>
        )}

        {watchedServiceType === 'accounting' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Accounting Details</h3>
            <SelectField
              form={form}
              name="accounting_period"
              label="Accounting Period"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annual', label: 'Annual' }
              ]}
              placeholder="Select period"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
