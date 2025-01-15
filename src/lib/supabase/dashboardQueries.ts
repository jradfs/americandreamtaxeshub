import { getServerClient } from '@/lib/supabase/server-client'
import type { Database } from '@/types/database.types'

type TaxReturnStatus = Database['public']['Enums']['tax_return_status']
type ProjectStatus = Database['public']['Enums']['project_status']
type ClientStatus = Database['public']['Enums']['client_status']

export async function getDashboardMetrics() {
  const supabase = getServerClient()

  try {
    // Get total active clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .eq('status', 'active' satisfies ClientStatus)

    if (clientsError) throw clientsError

    // Get pending tax returns
    const { data: taxReturns, error: taxReturnsError } = await supabase
      .from('tax_returns')
      .select('id')
      .eq('status', 'pending' satisfies TaxReturnStatus)

    if (taxReturnsError) throw taxReturnsError

    // Get active projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('status', 'in_progress' satisfies ProjectStatus)

    if (projectsError) throw projectsError

    return {
      activeClients: clients?.length || 0,
      pendingReturns: taxReturns?.length || 0,
      activeProjects: projects?.length || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw error
  }
} 