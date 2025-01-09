import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { TaskPriority, TaskStatus } from '@/types/tasks'

const supabase = createClientComponentClient<Database>()

// Onboarding task templates for different service types
const onboardingTaskTemplates = {
  'individual': [
    {
      title: 'Initial Client Meeting',
      description: 'Schedule and conduct initial meeting to understand client needs and gather basic information',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Document Collection',
      description: 'Request and collect all necessary tax documents from client',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date
      }
    },
    {
      title: 'Tax Return Preparation',
      description: 'Prepare individual tax return based on collected documents',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 14)
        return date
      }
    }
  ],
  'business': [
    {
      title: 'Business Onboarding Meeting',
      description: 'Set up initial meeting to understand business structure and requirements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 2)
        return date
      }
    },
    {
      title: 'Financial Document Collection',
      description: 'Collect business financial documents and statements',
      priority: 'high' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 3)
        return date
      }
    },
    {
      title: 'Business Tax Planning',
      description: 'Develop initial tax planning strategy based on business type and needs',
      priority: 'medium' as TaskPriority,
      estimateDueDate: () => {
        const date = new Date()
        date.setDate(date.getDate() + 5)
        return date
      }
    }
  ]
}

export async function generateOnboardingTasks(clientId: string, clientType: Database['public']['Enums']['client_type']) {
  try {
    const templates = onboardingTaskTemplates[clientType]
    if (!templates) {
      throw new Error(`No task templates found for client type: ${clientType}`)
    }

    const tasksToCreate = templates.map(template => ({
      title: template.title,
      description: template.description,
      status: 'todo' as TaskStatus,
      priority: template.priority,
      due_date: template.estimateDueDate()?.toISOString(),
      client_id: clientId,
      category: 'onboarding',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksToCreate)
      .select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error generating onboarding tasks:', error)
    throw error
  }
}

export async function createTask(taskData: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function updateTask(taskId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export async function getTasksByClient(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
} 