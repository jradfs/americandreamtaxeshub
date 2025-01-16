import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  ProjectFormValues,
  projectSchema,
  ServiceType,
} from "@/lib/validations/project";
import { Database } from "@/types/database.types";
import { ProjectTemplate } from "@/types/projects";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

interface UseProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}

export function useProjectForm({
  defaultValues,
  onSubmit,
}: UseProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      status: "not_started",
      priority: "medium",
      service_type: "tax_return",
      tax_info: null,
      accounting_info: null,
      payroll_info: null,
      service_info: null,
      completed_tasks: 0,
      completion_percentage: 0,
      task_count: 0,
      ...defaultValues,
    },
  });

  const calculateProgress = () => {
    const fields = form.getValues();
    const requiredFields = ["name", "client_id", "service_type", "due_date"];

    const serviceFields = {
      tax_return: ["tax_info"],
      bookkeeping: ["accounting_info"],
      payroll: ["payroll_info"],
      advisory: ["service_info"],
    } as const;

    let completed = 0;
    let total = requiredFields.length;

    // Check basic required fields
    for (const field of requiredFields) {
      if (fields[field as keyof ProjectFormValues]) {
        completed++;
      }
    }

    // Check service-specific fields
    if (fields.service_type && serviceFields[fields.service_type]) {
      const serviceSpecificFields = serviceFields[fields.service_type];
      total += serviceSpecificFields.length;
      for (const field of serviceSpecificFields) {
        if (fields[field as keyof ProjectFormValues]) {
          completed++;
        }
      }
    }

    // Calculate percentage
    const percentage = (completed / total) * 100;
    setProgress(Math.round(percentage));
  };

  const onServiceTypeChange = (type: ServiceType) => {
    // Reset service-specific fields when type changes
    form.setValue("service_type", type);
    form.setValue("tax_info", null);
    form.setValue("accounting_info", null);
    form.setValue("payroll_info", null);
    form.setValue("service_info", null);
    calculateProgress();
  };

  const onTemplateSelect = (template: ProjectTemplate | null) => {
    if (!template) {
      form.setValue("template_id", null);
      return;
    }

    form.setValue("template_id", template.id);
    if (template.project_defaults) {
      const defaults = template.project_defaults as Partial<ProjectRow>;
      Object.entries(defaults).forEach(([key, value]) => {
        form.setValue(key as keyof ProjectFormValues, value);
      });
    }
    calculateProgress();
  };

  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setIsSubmitting(true);
      const values = form.getValues();
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    progress,
    onServiceTypeChange,
    onTemplateSelect,
    onSubmit: handleSubmit,
    calculateProgress,
  };
}
