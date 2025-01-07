'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BasicInfoSection } from './BasicInfoSection';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { TaskSection } from './TaskSection';
import { useProjectFormContext } from './ProjectFormContext';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '@/types/tasks';
import { TemplateTask } from '@/lib/validations/project';

interface ProjectFormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  getTabProgress: (tab: string) => number;
}

export function ProjectFormTabs({ activeTab, onTabChange, getTabProgress }: ProjectFormTabsProps) {
  const { form } = useProjectFormContext();

  const validateTaskFields = (task: Task | TaskFormData | TemplateTask): TemplateTask => {
    const baseTask = {
      id: 'id' in task ? task.id : undefined,
      title: task.title || '',
      description: task.description,
      priority: (task.priority || 'medium') as TaskPriority,
      dependencies: 'dependencies' in task ? task.dependencies : [],
      assigned_team: 'assigned_team' in task ? task.assigned_team : [],
      order_index: 'order_index' in task ? task.order_index : undefined
    };

    return baseTask;
  };

  const handleAddTask = (task: TaskFormData) => {
    const currentTasks = form.getValues('template_tasks') || [];
    const validatedTask = validateTaskFields(task);
    form.setValue('template_tasks', [...currentTasks, validatedTask], { shouldValidate: true });
  };

  const handleEditTask = (index: number, task: Task | TaskFormData | TemplateTask) => {
    const currentTasks = form.getValues('template_tasks') || [];
    const updatedTasks = [...currentTasks];
    const validatedTask = validateTaskFields(task);
    updatedTasks[index] = validatedTask;
    form.setValue('template_tasks', updatedTasks, { shouldValidate: true });
  };

  const handleDeleteTask = (index: number) => {
    const currentTasks = form.getValues('template_tasks') || [];
    const updatedTasks = currentTasks.filter((_, i) => i !== index);
    form.setValue('template_tasks', updatedTasks, { shouldValidate: true });
  };

  const handleReorderTasks = (tasks: TemplateTask[]) => {
    const validatedTasks = tasks.map(validateTaskFields);
    form.setValue('template_tasks', validatedTasks, { shouldValidate: true });
  };

  const tasks = form.getValues('template_tasks') || [];

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
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks}
        />
      </TabsContent>
    </Tabs>
  );
} 