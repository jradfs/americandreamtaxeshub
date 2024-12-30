import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select('*');

    if (error) {
      console.error('Supabase error:', error);
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
    const supabase = await createClient();
    const { full_name, contact_email, company_name, type, status, tax_info, contact_info } = await request.json();

    const { data, error } = await supabase
      .from('clients')
      .insert([{ full_name, contact_email, company_name, type, status, tax_info, contact_info }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { id, full_name, contact_email, company_name, type, status, tax_info, contact_info } = await request.json();

    const { data, error } = await supabase
      .from('clients')
      .update({ full_name, contact_email, company_name, type, status, tax_info, contact_info })
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
    const supabase = await createClient();
    const { id } = await request.json();

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Client deleted' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
