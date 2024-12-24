import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { toast } from "@/components/ui/use-toast"

export async function updateTask(
  taskId: string, 
  updates: Partial<Database['public']['Tables']['tasks']['Row']>
) {
  const supabase = createClientComponentClient<Database>()
  
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
    .select()

  if (error) {
    toast({
      title: "Error Updating Task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}

export async function getTasks() {
  const supabase = createClientComponentClient<Database>()
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    toast({
      title: "Error Fetching Tasks",
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
  const supabase = createClientComponentClient<Database>()
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) {
    toast({
      title: "Error Creating Task",
      description: error.message,
      variant: "destructive"
    })
    throw error
  }

  return data
}
