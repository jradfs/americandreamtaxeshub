import { useState } from 'react';
import { type TaskSchema } from '@/lib/validations/project';

export type TaskDependencyError = Record<string, string>;

export const useTaskValidation = () => {
  const [taskDependencyErrors, setTaskDependencyErrors] = useState<TaskDependencyError>({});

  const detectCircularDependencies = (tasks: TaskSchema[], taskId: string, visited: Set<string>, path: string[]): boolean => {
    if (visited.has(taskId)) {
      if (path.includes(taskId)) {
        // Found a circular dependency
        const cycle = path.slice(path.indexOf(taskId));
        cycle.push(taskId);
        return true;
      }
      return false;
    }

    visited.add(taskId);
    path.push(taskId);

    const task = tasks.find(t => t.title === taskId);
    if (task?.dependencies) {
      for (const depId of task.dependencies) {
        if (detectCircularDependencies(tasks, depId, visited, path)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  };

  const validateTaskDependencies = (tasks: TaskSchema[] | undefined) => {
    if (!tasks || tasks.length === 0) return true;
    
    const errors: TaskDependencyError = {};
    
    tasks.forEach(task => {
      // Ensure dependencies is an array
      if (task.dependencies && !Array.isArray(task.dependencies)) {
        errors[task.title] = 'Dependencies must be an array';
        return;
      }

      // Validate dependency IDs exist in the task list
      if (task.dependencies) {
        const invalidDeps = task.dependencies.filter(dep => 
          !tasks.some(t => t.title === dep)
        );
        if (invalidDeps.length > 0) {
          errors[task.title] = `Invalid dependencies: ${invalidDeps.join(', ')}`;
          return;
        }

        // Check for circular dependencies
        const visited = new Set<string>();
        if (detectCircularDependencies(tasks, task.title, visited, [])) {
          errors[task.title] = 'Circular dependency detected';
          return;
        }
      }

      // Validate task order if provided
      if (task.order_index !== undefined) {
        const duplicateOrder = tasks.some(t => 
          t !== task && t.order_index === task.order_index
        );
        if (duplicateOrder) {
          errors[task.title] = 'Duplicate task order detected';
        }
      }
    });

    setTaskDependencyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    taskDependencyErrors,
    validateTaskDependencies,
  };
};
