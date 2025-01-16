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

// Create new client
export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;
  
  try {
    const clientData = await request.json();
    
    // Validate required fields
    if (!clientData.full_name || !clientData.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
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

// Get clients - all or single by ID
export async function GET(
  request: Request,
  { params }: { params?: { id: string } }
) {
  try {
    if (params?.id) {
      // Get single client
      const { data, error } = await supabase
        .from('clients')
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
          { error: 'Client not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all clients
      const { data, error } = await supabase
        .from('clients')
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

// Update client
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientData = await request.json();
    
    // Validate required fields
    if (!clientData.full_name || !clientData.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
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


// Delete client
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('clients')
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