import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database.types'
import { generateOnboardingTasks } from '@/lib/services/task.service'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const json = await request.json()

    // Create the client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert(json)
      .select()
      .single()

    if (clientError) {
      throw clientError
    }

    // Generate onboarding tasks if client type is provided
    if (client.type) {
      try {
        await generateOnboardingTasks(client.id, client.type)
      } catch (error) {
        console.error('Failed to generate onboarding tasks:', error)
        // Don't throw here - we still want to return the created client
      }
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const json = await request.json()
    const { id, ...updates } = json

    const { data: client, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
} 