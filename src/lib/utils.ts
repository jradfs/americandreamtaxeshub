// This is a test comment to ensure the file is being overwritten correctly
import { Task } from '@/types/task';

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function filterTasks(tasks: Task[], filters: { dueDate?: Date }) {
  if (!filters.dueDate) {
    return tasks;
  }
  return tasks.filter((task) => {
    if (!task.dueDate) {
      return true;
    }
    return new Date(task.dueDate) <= filters.dueDate;
  });
}

export function groupTasks(tasks: Task[], groupBy: string) {
  if (!groupBy) {
    return tasks;
  }

  const groupedTasks = tasks.reduce((acc, task) => {
    const key = task[groupBy as keyof Task] as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  return groupedTasks;
}
