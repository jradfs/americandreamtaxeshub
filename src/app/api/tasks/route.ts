import createClient from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabase = createClient();

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}

// Create new task
export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const taskData = await request.json();
    
    // Validate required fields
    if (!taskData.title || !taskData.project_id) {
      return NextResponse.json(
        { error: 'Task title and project ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get tasks - handles both list and single task
export async function GET(
  request: Request,
  { params }: { params?: { id: string } }
) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    if (params?.id) {
      // Get single task
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all tasks
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update task
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const taskData = await request.json();
    
    // Validate required fields
    if (!taskData.title || !taskData.project_id) {
      return NextResponse.json(
        { error: 'Task title and project ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get task's subtasks
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_task_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}