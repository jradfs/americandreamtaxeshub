import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues, ServiceType, ServiceCategory } from '@/types/hooks';

export function useServiceFields(form: UseFormReturn<ProjectFormValues>) {
  const handleServiceTypeChange = (currentType: ServiceType | ServiceCategory) => {
    if (currentType !== 'uncategorized') {
      // Reset specific service fields based on type
      switch (currentType) {
        case 'tax_return':
          form.setValue('tax_return_id', undefined);
          form.setValue('tax_return_status', undefined);
          break;
        case 'accounting':
          form.setValue('accounting_period', undefined);
          break;
        // Add other service type specific resets
      }
    }
  };

  const calculateProgress = (serviceType: string) => {
    // Progress calculation logic
    return 50; // Placeholder
  };

  const validateServiceSpecificFields = () => {
    const currentType = form.getValues('service_type');
    const currentTasks = form.getValues('tasks') || [];

    if (currentType !== 'uncategorized' && currentTasks.length > 0) {
      // Validation logic
      return true;
    }

    return false;
  };

  return {
    handleServiceTypeChange,
    calculateProgress,
    validateServiceSpecificFields
  };
}
