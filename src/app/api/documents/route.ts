import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: documents, error } = await supabase
    .from('client_documents')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(documents)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const data = await request.json()

  const { data: document, error } = await supabase
    .from('client_documents')
    .insert([data])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(document)
}

export async function PUT(request: NextRequest) {
  const supabase = createClient()
  const data = await request.json()
  const { id, ...updates } = data

  const { data: document, error } = await supabase
    .from('client_documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(document)
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
