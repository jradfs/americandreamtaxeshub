'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectForm } from '@/hooks/useProjectForm';
import { ProjectFormProvider } from './ProjectFormContext';
import { BasicInfoSection } from './BasicInfoSection';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { TaskSection } from './TaskSection';
import { Progress } from '@/components/ui/progress';
import { ProjectFormValues } from '@/lib/validations/project';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}

export function ProjectForm({ defaultValues, onSubmit }: ProjectFormProps) {
  const {
    form,
    isSubmitting,
    progress,
    onServiceTypeChange,
    onTemplateSelect,
    onSubmit: handleSubmit,
  } = useProjectForm({
    defaultValues,
    onSubmit,
  });

  const handleAddTask = (task: DbTaskInsert) => {
    const tasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', [...tasks, { ...task, activity_log: [], checklist: [] }]);
  };

  const handleEditTask = (task: DbTaskInsert, index: number) => {
    const tasks = form.getValues('template_tasks') || [];
    const updatedTasks = [...tasks];
    updatedTasks[index] = task;
    form.setValue('template_tasks', updatedTasks);
  };

  const handleDeleteTask = (index: number) => {
    const tasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', tasks.filter((_, i) => i !== index));
  };

  const handleReorderTasks = (tasks: DbTaskInsert[]) => {
    form.setValue('template_tasks', tasks);
  };

  return (
    <ProjectFormProvider
      form={form}
      isSubmitting={isSubmitting}
      onServiceTypeChange={onServiceTypeChange}
      onTemplateSelect={onTemplateSelect}
      progress={progress}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {defaultValues?.name ? 'Edit Project' : 'New Project'}
          </h2>
          <Progress value={progress} className="w-[200px]" />
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="service">Service Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoSection />
          </TabsContent>

          <TabsContent value="service" className="space-y-4 mt-4">
            <ServiceDetailsSection />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-4">
            <TaskSection
              projectId={form.getValues('client_id') || ''}
              tasks={form.getValues('template_tasks') || []}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onReorderTasks={handleReorderTasks}
            />
          </TabsContent>
        </Tabs>
      </form>
    </ProjectFormProvider>
  );
} 