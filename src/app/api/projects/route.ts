import { NextResponse } from 'next/server';
import { createClient } from 'src/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient(true);
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST request received:', {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    let supabase;
    try {
      supabase = await createClient(true);
      console.log('Supabase client created successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Supabase client creation failed:', {
          message: error.message,
          stack: error.stack
        });
        return NextResponse.json({ 
          error: 'Failed to initialize database client',
          details: error.message 
        }, { status: 500 });
      }
      return NextResponse.json({ 
        error: 'Failed to initialize database client',
        details: 'Unknown error occurred'
      }, { status: 500 });
    }
    
    const requestBody = await request.json();
    console.log('Request body:', requestBody);
    const { name, description, client_id, due_date } = requestBody;

    const insertQuery = supabase
      .from('projects')
      .insert([{ 
        name, 
        description, 
        client_id, 
        due_date,
        status: 'todo' // Explicitly set status
      }])
      .select();
    console.log('Executing query:', insertQuery);
    const { data, error } = await insertQuery;
    console.log('Query result:', { data, error });

    if (error) {
      console.error('Supabase POST error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error)
      }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('POST endpoint error:', {
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: error.message 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Invalid request body',
      details: 'Unknown error occurred'
    }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient(true);
    const { id, name, description, client_id, due_date } = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .update({ name, description, client_id, due_date })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient(true);
    const { id } = await request.json();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
