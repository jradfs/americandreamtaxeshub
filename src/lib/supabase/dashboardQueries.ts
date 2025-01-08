import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function getDashboardMetrics() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Get total active clients
    const { count: totalActiveClients, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (clientsError) throw new Error(`Failed to fetch active clients: ${clientsError.message}`);

    // Get pending tax returns (not_started or gathering_documents)
    const { count: pendingTaxReturns, error: taxReturnsError } = await supabase
      .from('tax_returns')
      .select('*', { count: 'exact', head: true })
      .in('status', ['not_started', 'gathering_documents']);

    if (taxReturnsError) throw new Error(`Failed to fetch pending tax returns: ${taxReturnsError.message}`);

    // Get active projects (todo, in_progress, or review)
    const { count: activeProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['todo', 'in_progress', 'review']);

    if (projectsError) throw new Error(`Failed to fetch active projects: ${projectsError.message}`);

    // Get upcoming deadlines (tasks due in the next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { count: upcomingDeadlines, error: deadlinesError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .lte('due_date', sevenDaysFromNow.toISOString())
      .gt('due_date', new Date().toISOString())
      .not('status', 'eq', 'completed');

    if (deadlinesError) throw new Error(`Failed to fetch upcoming deadlines: ${deadlinesError.message}`);

    return {
      totalActiveClients: totalActiveClients || 0,
      pendingTaxReturns: pendingTaxReturns || 0,
      activeProjects: activeProjects || 0,
      upcomingDeadlines: upcomingDeadlines || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
} 