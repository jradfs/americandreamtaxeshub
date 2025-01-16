"use client";

import { useToast } from "@/components/ui/use-toast";
import { supabaseBrowserClient as supabase } from "@/lib/supabaseBrowserClient";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import type { TaskWithRelations } from "@/types/tasks";

interface UseTasksOptions {
  projectId?: string;
}

export function useTasks({ projectId }: UseTasksOptions = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch tasks with project filtering and relationships
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select(`
          *,
          project:projects!project_id(id,name),
          assignee:users!tasks_assignee_id_fkey(id,email,full_name,role),
          parent_task:tasks!parent_task_id(id,title),
          checklist_items(*),
          activity_log_entries(*)
        `);
      
      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform assignee array to single object
      const transformedData = data?.map(task => ({
        ...task,
        assignee: task.assignee?.[0] || null
      }));

      return transformedData as TaskWithRelations[];
    },
  });

  const addTask = async (taskData: any) => {
    try {
      const { data: newTask, error } = await supabase
        .from("tasks")
        .insert([taskData])
        .select(`
          *,
          project:projects!project_id(id,name),
          assignee:users!tasks_assignee_id_fkey(id,email,full_name,role),
          parent_task:tasks!parent_task_id(id,title),
          checklist_items(*),
          activity_log_entries(*)
        `)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add task",
          variant: "destructive",
        });
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast({
        title: "Success",
        description: "Task added successfully.",
      });

      return {
        ...newTask,
        assignee: newTask.assignee?.[0] || null
      } as TaskWithRelations;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: any) => {
    try {
      const { data: updatedTask, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          project:projects!project_id(id,name),
          assignee:users!tasks_assignee_id_fkey(id,email,full_name,role),
          parent_task:tasks!parent_task_id(id,title),
          checklist_items(*),
          activity_log_entries(*)
        `)
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast({
        title: "Success",
        description: "Task updated successfully.",
      });

      return {
        ...updatedTask,
        assignee: updatedTask.assignee?.[0] || null
      } as TaskWithRelations;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
  };
}
