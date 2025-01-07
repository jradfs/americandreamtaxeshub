import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database.types';
import { taskSchema } from '@/types/validation';
import type { z } from 'zod';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type ValidatedTask = z.infer<typeof taskSchema>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const assigneeId = searchParams.get('assigneeId');

    const supabase = createRouteHandlerClient<Database>({ cookies });

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles(id, full_name, email),
        project:projects(id, name),
        parent_task:tasks(id, title)
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
    const formData = await request.json();
    const validatedData: ValidatedTask = taskSchema.parse(formData);

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Convert form data to database format
    const taskData: TaskInsert = {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      due_date: validatedData.due_date,
      assignee_id: validatedData.assignee_id,
      project_id: validatedData.project_id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
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
    const { id, ...updates } = await request.json();
    const validatedData: Partial<ValidatedTask> = taskSchema.partial().parse(updates);

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Convert form data to database format
    const taskData: Partial<TaskInsert> = {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      due_date: validatedData.due_date,
      assignee_id: validatedData.assignee_id,
      project_id: validatedData.project_id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
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

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

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
