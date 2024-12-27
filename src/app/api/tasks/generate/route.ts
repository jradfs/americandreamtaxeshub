import { NextResponse } from 'next/server';
import { createClient } from 'src/lib/supabase/server';
import { classifyTask } from 'src/lib/ai/tasks';

interface TemplateTask {
  title: string;
  description: string;
}

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

  // Insert tasks for project with classification
  const tasksToInsert = await Promise.all(templateTasks.map(async (task: TemplateTask) => {
    const category = await classifyTask(task.title, task.description);
    return {
      project_id,
      title: task.title,
      description: task.description,
      status: 'not_started',
      category
    };
  }));

  const { data: insertedTasks, error: insertError } = await supabase
    .from('tasks')
    .insert(tasksToInsert)
    .select();

  if (insertError) {
    console.error('Failed to insert tasks:', insertError);
    return NextResponse.json(
      { error: 'Failed to generate tasks', details: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(insertedTasks);
}