import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get('project_id');

  if (!project_id) {
    return NextResponse.json(
      { error: 'project_id is required' },
      { status: 400 }
    );
  }

  const { data: documents, error } = await supabase
    .from('document_tracking')
    .select('*')
    .eq('project_id', project_id);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch document status' },
      { status: 500 }
    );
  }

  return NextResponse.json(documents);
}