import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { project_id, template_id } = await request.json();

  if (!project_id || !template_id) {
    return NextResponse.json(
      { error: 'project_id and template_id are required' },
      { status: 400 }
    );
  }

  // Fetch template tasks
  const { data: templateTasks, error } = await supabase
    .from('template_tasks')
    .select('*')
    .eq('template_id', template_id);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template tasks' },
      { status: 500 }
    );
  }

  // Insert tasks for project
  const tasksToInsert = templateTasks.map(task => ({
    project_id,
    name: task.name,
    description: task.description,
    status: 'not_started'
  }));

  const { data: insertedTasks, error: insertError } = await supabase
    .from('tasks')
    .insert(tasksToInsert)
    .select();

  if (insertError) {
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    );
  }

  return NextResponse.json(insertedTasks);
}