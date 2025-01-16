"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProjectFormProvider } from "./ProjectFormContext";
import { BasicInfoSection } from "./BasicInfoSection";
import { TaskSection } from "./TaskSection";
import { projectSchema } from "@/lib/validations/project";
import type {
  ProjectFormData,
  ProjectWithRelations,
  ServiceType,
} from "@/types/projects";

interface ProjectFormProps {
  initialData?: Partial<ProjectWithRelations>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "not_started",
      service_type: (initialData?.service_type as ServiceType) || "tax_return",
      priority: initialData?.priority || "medium",
      start_date: initialData?.start_date || null,
      due_date: initialData?.due_date || null,
      client_id: initialData?.client_id || null,
      template_id: initialData?.template_id || null,
      tax_info: initialData?.tax_info || null,
      accounting_info: initialData?.accounting_info || null,
      payroll_info: initialData?.payroll_info || null,
      service_info: initialData?.service_info || null,
      tax_return_id: initialData?.tax_return_id || null,
      parent_project_id: initialData?.parent_project_id || null,
      primary_manager: initialData?.primary_manager || null,
      stage: initialData?.stage || null,
    },
  });

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to submit project",
      });
    }
  };

  return (
    <ProjectFormProvider form={form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <BasicInfoSection />
            </TabsContent>
            <TabsContent value="tasks">
              <TaskSection projectId={initialData?.id ?? ""} />
            </TabsContent>
          </Tabs>

          {form.formState.errors.root && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Form>
    </ProjectFormProvider>
  );
}
