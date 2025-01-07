'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useProjectFormContext } from './ProjectFormContext';
import { TaxInfoFields } from './service-fields/TaxInfoFields';
import { AccountingInfoFields } from './service-fields/AccountingInfoFields';
import { PayrollInfoFields } from './service-fields/PayrollInfoFields';
import { TaxInfo, AccountingInfo, PayrollInfo } from '@/types/projects';
import { ProjectFormValues } from '@/lib/validations/project';

export function ServiceDetailsSection() {
  const { form } = useProjectFormContext();
  const serviceType = form.watch('service_type');

  const renderServiceFields = () => {
    switch (serviceType) {
      case 'tax_return':
        return (
          <Card>
            <CardContent className="p-6">
              <TaxInfoFields
                value={(form.watch('tax_info') as ProjectFormValues['tax_info']) || {}}
                onChange={(value) => form.setValue('tax_info', value as ProjectFormValues['tax_info'])}
              />
            </CardContent>
          </Card>
        );
      case 'bookkeeping':
        return (
          <Card>
            <CardContent className="p-6">
              <AccountingInfoFields
                value={(form.watch('accounting_info') as ProjectFormValues['accounting_info']) || {}}
                onChange={(value) => form.setValue('accounting_info', value as ProjectFormValues['accounting_info'])}
              />
            </CardContent>
          </Card>
        );
      case 'payroll':
        return (
          <Card>
            <CardContent className="p-6">
              <PayrollInfoFields
                value={(form.watch('payroll_info') as ProjectFormValues['payroll_info']) || {}}
                onChange={(value) => form.setValue('payroll_info', value as ProjectFormValues['payroll_info'])}
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderServiceFields()}
    </div>
  );
} 