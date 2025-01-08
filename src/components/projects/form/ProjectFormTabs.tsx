'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BasicInfoSection } from './BasicInfoSection';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { TaskSection } from './TaskSection';
import { useProjectFormContext } from './ProjectFormContext';
import type { Database } from '@/types/database.types';

type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];

interface ProjectFormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  getTabProgress: (tab: string) => number;
}

export function ProjectFormTabs({ activeTab, onTabChange, getTabProgress }: ProjectFormTabsProps) {
  const { form } = useProjectFormContext();

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
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
  );
} 