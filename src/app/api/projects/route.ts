import { createClient } from '@/lib/supabase/client';
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

// Create new project
export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name || !projectData.client_id) {
      return NextResponse.json(
        { error: 'Project name and client ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
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

// Get projects - handles both list and single project
export async function GET(
  request: Request,
  { params }: { params?: { id: string } }
) {
  try {
    if (params?.id) {
      // Get single project
      const { data, error } = await supabase
        .from('projects')
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
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all projects
      const { data, error } = await supabase
        .from('projects')
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

// Update project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name || !projectData.client_id) {
      return NextResponse.json(
        { error: 'Project name and client ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
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

// Get project's tasks
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
      .eq('project_id', params.id)
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

// Delete project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const { error } = await supabase
      .from('projects')
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