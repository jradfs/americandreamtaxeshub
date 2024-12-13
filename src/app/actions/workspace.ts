'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Task } from '@/types/task-management';
import { revalidatePath } from 'next/cache';

export async function createTask(workspaceId: string, taskData: Partial<Task>) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...taskData,
      workspace_id: workspaceId,
      assigned_user_id: taskData.assigned_user_id || user.id,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  revalidatePath('/workspace');
  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  // Get the current task data
  const { data: currentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (fetchError) {
    console.error('Error fetching task:', fetchError);
    throw fetchError;
  }

  // Convert camelCase to snake_case for database fields
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
    workspace_id: currentTask.workspace_id,
    // Convert any camelCase keys to snake_case
    ...(updates.dueDate && { due_date: updates.dueDate }),
    ...(updates.assignedUserId && { assigned_user_id: updates.assignedUserId }),
    ...(updates.workspaceId && { workspace_id: updates.workspaceId })
  };

  // Remove any camelCase keys to prevent conflicts
  delete updateData.dueDate;
  delete updateData.assignedUserId;
  delete updateData.workspaceId;
  delete updateData.updatedAt;

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  revalidatePath('/workspace');
  return data;
}

export async function deleteTask(taskId: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  revalidatePath('/workspace');
  return true;
}
