import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database.types';
import { taskSchema } from '@/types/validation';
import type { z } from 'zod';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type ValidatedTask = z.infer<typeof taskSchema>;
type ChecklistItemInsert = Database['public']['Tables']['checklist_items']['Insert'];
type ActivityLogInsert = Database['public']['Tables']['activity_log_entries']['Insert'];

interface TaskInput extends ValidatedTask {
  checklistItems?: Array<{
    title: string;
    description?: string | null;
    completed?: boolean;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const assigneeId = searchParams.get('assigneeId');

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          }
        }
      }
    );

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles(id, full_name, email),
        project:projects(id, name),
        parent_task:tasks(id, title),
        checklist_items(*),
        activity_log_entries(*)
      `);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (assigneeId) {
      query = query.eq('assignee_id', assigneeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData: TaskInput = await request.json();
    const { checklistItems, ...taskData } = formData;
    const validatedData = taskSchema.parse(taskData);

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          }
        }
      }
    );

    // Insert task first
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert([{
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        due_date: validatedData.due_date,
        assignee_id: validatedData.assignee_id,
        project_id: validatedData.project_id,
      } satisfies TaskInsert])
      .select()
      .single();

    if (taskError) throw taskError;

    // Handle checklist items if provided
    if (checklistItems?.length) {
      const { error: checklistError } = await supabase
        .from('checklist_items')
        .insert(
          checklistItems.map(item => ({
            task_id: task.id,
            title: item.title,
            description: item.description,
            completed: item.completed || false
          }))
        );

      if (checklistError) throw checklistError;
    }

    // Add activity log entry
    const { error: activityError } = await supabase
      .from('activity_log_entries')
      .insert({
        task_id: task.id,
        action: 'created',
        details: { status: task.status }
      });

    if (activityError) throw activityError;

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, checklistItems, ...updates }: TaskInput & { id: string } = await request.json();
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Valid task ID (UUID) is required' },
        { status: 400 }
      );
    }

    const validatedData = taskSchema.partial().parse(updates);
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          }
        }
      }
    );

    // Update task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        due_date: validatedData.due_date,
        assignee_id: validatedData.assignee_id,
        project_id: validatedData.project_id,
      })
      .eq('id', id)
      .select()
      .single();

    if (taskError) throw taskError;

    // Handle checklist items if provided
    if (checklistItems !== undefined) {
      // Delete existing items
      await supabase
        .from('checklist_items')
        .delete()
        .eq('task_id', id);

      // Insert new items
      if (checklistItems.length > 0) {
        const { error: checklistError } = await supabase
          .from('checklist_items')
          .insert(
            checklistItems.map(item => ({
              task_id: id,
              title: item.title,
              description: item.description,
              completed: item.completed || false
            } satisfies ChecklistItemInsert))
          );

        if (checklistError) throw checklistError;
      }
    }

    // Add activity log entry for update
    const { error: activityError } = await supabase
      .from('activity_log_entries')
      .insert({
        task_id: id,
        action: 'updated',
        details: { updates: validatedData }
      } satisfies ActivityLogInsert);

    if (activityError) throw activityError;

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Valid task ID (UUID) is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          }
        }
      }
    );

    // Delete related records first (due to foreign key constraints)
    await Promise.all([
      supabase.from('checklist_items').delete().eq('task_id', id),
      supabase.from('activity_log_entries').delete().eq('task_id', id)
    ]);

    // Then delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'
