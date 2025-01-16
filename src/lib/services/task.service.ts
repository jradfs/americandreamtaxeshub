import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import type { Database } from "@/types/database.types";

export const createTaskForReturn = async (
  task: Database["public"]["Tables"]["tasks"]["Insert"],
) => {
  const { data, error } = await supabaseBrowserClient
    .from("tasks")
    .insert({
      ...task,
      category: "tax_return",
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const generateOnboardingTasks = async (
  clientId: string,
  clientType: string,
) => {
  // Define default onboarding tasks based on client type
  const defaultTasks = {
    individual: [
      {
        title: "Collect W-2 forms",
        description: "Request W-2 forms from employer",
      },
      {
        title: "Gather 1099 forms",
        description: "Collect any 1099 forms for freelance work",
      },
    ],
    business: [
      {
        title: "Collect financial statements",
        description: "Gather balance sheet and income statement",
      },
      {
        title: "Gather payroll records",
        description: "Collect all payroll documentation",
      },
    ],
  };

  const tasks = defaultTasks[clientType as keyof typeof defaultTasks] || [];

  // Create tasks in database
  for (const task of tasks) {
    await TaskService.createTask({
      ...task,
      project_id: clientId,
      category: "onboarding",
      status: "pending",
    });
  }
};

export class TaskService {
  static async getTasks() {
    const { data, error } = await supabaseBrowserClient
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createTask(
    task: Database["public"]["Tables"]["tasks"]["Insert"],
  ) {
    const { data, error } = await supabaseBrowserClient
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTask(
    id: string,
    task: Partial<Database["public"]["Tables"]["tasks"]["Update"]>,
  ) {
    const { data, error } = await supabaseBrowserClient
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTask(id: string) {
    const { error } = await supabaseBrowserClient
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
