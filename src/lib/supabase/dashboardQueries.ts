import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

type TaxReturnStatus = Database['public']['Enums']['tax_return_status'];
type ProjectStatus = Database['public']['Enums']['project_status'];
type ClientStatus = Database['public']['Enums']['client_status'];

export async function getDashboardMetrics() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Debug: Check if we can access the tax_returns table at all
    console.log('Checking tax_returns table access...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('tax_returns')
      .select('status')
      .limit(1);

    if (tableError) {
      console.error('Failed to access tax_returns table:', {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
        hint: tableError.hint
      });
    } else {
      console.log('Successfully accessed tax_returns table. Sample data:', tableCheck);
    }

    // Get total active clients
    const { count: totalActiveClients, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active' satisfies ClientStatus);

    if (clientsError) throw new Error(`Failed to fetch active clients: ${clientsError.message}`);

    // Get pending tax returns (not_started or gathering_documents)
    console.log('Attempting to fetch tax returns with status filter...');
    const statuses = ['not_started', 'gathering_documents'] satisfies TaxReturnStatus[];
    console.log('Using status filters:', statuses);
    
    const taxReturnsQuery = supabase
      .from('tax_returns')
      .select('*', { count: 'exact', head: true })
      .in('status', statuses);

    console.log('Executing query:', taxReturnsQuery.toSQL());
    const { count: pendingTaxReturns, error: taxReturnsError } = await taxReturnsQuery;

    if (taxReturnsError) {
      console.error('Tax returns query error details:', {
        message: taxReturnsError.message,
        code: taxReturnsError.code,
        details: taxReturnsError.details,
        hint: taxReturnsError.hint,
        query: taxReturnsQuery.toSQL()
      });
      throw new Error(`Failed to fetch pending tax returns: ${taxReturnsError.message}`);
    }

    console.log('Successfully fetched pending tax returns count:', pendingTaxReturns);

    // Get active projects (todo, in_progress, or review)
    const { count: activeProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['todo', 'in_progress', 'review'] satisfies ProjectStatus[]);

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