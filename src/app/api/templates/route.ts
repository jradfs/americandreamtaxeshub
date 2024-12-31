import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Database } from 'types/database';

export interface TemplateResponse {
  id: string;
  title: string;
  description: string;
  default_priority: string;
  project_defaults: Record<string, unknown>;
  category: {
    name: string;
  };
  tasks?: Array<{
    id: string;
    title: string;
    description: string | null;
    order_index: number | null;
    priority: string | null;
    dependencies: string[] | null;
  }>;
}

export async function GET() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: templates, error } = await supabase
      .from('project_templates')
      .select(`
        id,
        title,
        description,
        default_priority,
        project_defaults,
        category:template_categories(name),
        tasks:template_tasks!template_id(
          id,
          title,
          description,
          order_index,
          priority,
          dependencies
        )
      `)
      .order('title');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: templates as TemplateResponse[]
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch templates'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { title, description, categoryId } = await request.json();

  const { data, error } = await supabase
    .from('project_templates')
    .insert({
      title,
      description,
      category_id: categoryId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { id, title, description, categoryId } = await request.json();

  const { data, error } = await supabase
    .from('project_templates')
    .update({
      title,
      description,
      category_id: categoryId,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
