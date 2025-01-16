import { UseFormReturn } from "react-hook-form";

export function useProjectTabProgress(form: UseFormReturn<any>) {
  const getTabProgress = (tab: string): number => {
    const fields = {
      "basic-info": ["name", "description", "client_id", "priority"],
      "service-details": ["service_type"],
      tasks: ["tasks"],
    };

    const tabFields = fields[tab as keyof typeof fields] || [];
    if (!tabFields.length) return 100;

    const completedFields = tabFields.filter((field) => {
      const value = form.getValues(field);
      return value !== undefined && value !== "" && value !== null;
    });

    return Math.round((completedFields.length / tabFields.length) * 100);
  };

  return { getTabProgress };
}
