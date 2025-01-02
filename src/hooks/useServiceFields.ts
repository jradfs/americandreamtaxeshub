import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues, ServiceType } from '@/lib/validations/project';
import { toast } from 'sonner';

export function useServiceFields(form: UseFormReturn<ProjectFormValues>) {
  const handleServiceTypeChange = (serviceType: ServiceType) => {
    const currentTasks = form.getValues('tasks') || [];
    const currentType = form.getValues('service_type');

    // If changing from a specific service type and there are tasks, confirm
    if (currentType !== 'uncategorized' && currentTasks.length > 0) {
      if (!confirm('Changing service type will reset service-specific fields. Continue?')) {
        return;
      }
    }

    // Reset service-specific fields
    form.setValue('tax_return_id', undefined);
    form.setValue('tax_return_status', undefined);
    form.setValue('accounting_period', undefined);
    form.setValue('service_type', serviceType);

    // Reset template if service type changes
    if (currentType !== serviceType) {
      form.setValue('template_id', undefined);
      form.setValue('tasks', []);
    }

    toast.success('Service type updated');
  };

  const getRequiredFields = (serviceType: ServiceType): string[] => {
    const baseFields = ['name', 'client_id', 'service_type', 'priority'];

    switch (serviceType) {
      case 'tax_return':
        return [...baseFields, 'tax_return_id', 'tax_return_status'];
      case 'accounting':
        return [...baseFields, 'accounting_period'];
      default:
        return baseFields;
    }
  };

  const calculateProgress = (serviceType: ServiceType): number => {
    const requiredFields = getRequiredFields(serviceType);
    const filledFields = requiredFields.filter(field => {
      const value = form.watch(field);
      return value !== undefined && value !== '';
    });

    // Add extra progress for optional fields if filled
    let extraProgress = 0;
    const optionalFields = ['description', 'due_date', 'team_members', 'tasks'];
    const filledOptionalFields = optionalFields.filter(field => {
      const value = form.watch(field);
      return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
    });

    if (filledOptionalFields.length > 0) {
      extraProgress = (filledOptionalFields.length / optionalFields.length) * 20; // Extra 20% for optional fields
    }

    const baseProgress = (filledFields.length / requiredFields.length) * 80; // Base 80% for required fields
    return Math.min(100, Math.round(baseProgress + extraProgress));
  };

  const validateServiceSpecificFields = (): boolean => {
    const serviceType = form.getValues('service_type');
    const requiredFields = getRequiredFields(serviceType);
    
    return requiredFields.every(field => {
      const value = form.getValues(field);
      return value !== undefined && value !== '';
    });
  };

  return {
    handleServiceTypeChange,
    getRequiredFields,
    calculateProgress,
    validateServiceSpecificFields
  };
}
