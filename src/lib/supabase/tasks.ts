import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { toast } from "@/components/ui/use-toast"

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function updateTask(
  taskId: string, 
  updates: Partial<Database['public']['Tables']['tasks']['Row']>
) {
  // Prepare updates, removing any undefined or null values
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
  )

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...filteredUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)

  if (error) {
    toast({
      title: "Error updating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')

  if (error) {
    toast({
      title: "Error fetching tasks",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function createTask(
  taskData: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    toast({
      title: "Error creating task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}
