import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { getSupabaseServerClient } from '@/lib/supabaseServerClient';

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();

  // Fetch calendar events from Supabase
  const { data: calendarEvents, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching calendar events:', error);
  }

  return (
    <DashboardShell calendarEvents={calendarEvents || []}>
      {/* Additional dashboard widgets will go here */}
    </DashboardShell>
  );
}
