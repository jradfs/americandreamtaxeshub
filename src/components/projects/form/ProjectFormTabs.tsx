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
    form.setValue('template_tasks', [...tasks, task]);
  };

  const handleEditTask = (task: DbTaskInsert, taskId: string) => {
    const tasks = form.getValues('template_tasks') || [];
    const updatedTasks = tasks.map(t => t.id === taskId ? task : t);
    form.setValue('template_tasks', updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const tasks = form.getValues('template_tasks') || [];
    form.setValue('template_tasks', tasks.filter(t => t.id !== taskId));
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="service">Service Details</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <Progress value={getTabProgress(activeTab)} className="w-full" />
      </div>

      <TabsContent value="basic" className="mt-4">
        <BasicInfoSection />
      </TabsContent>

      <TabsContent value="service" className="mt-4">
        <ServiceDetailsSection />
      </TabsContent>

      <TabsContent value="tasks" className="mt-4">
        <TaskSection
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </TabsContent>
    </Tabs>
  );
} 