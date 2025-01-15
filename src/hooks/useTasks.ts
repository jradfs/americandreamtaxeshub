'use client'

import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient as supabase } from '@/lib/supabaseBrowserClient';
import { useQueryClient } from '@tanstack/react-query';

export function useTasks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addTask = async (taskData: any) => {
    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to add task',
          variant: 'destructive',
        });
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task added successfully.',
      });

      return newTask;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: any) => {
    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update task',
          variant: 'destructive',
        });
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      });

      return updatedTask;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete task',
          variant: 'destructive',
        });
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    addTask,
    updateTask,
    deleteTask,
  };
}
