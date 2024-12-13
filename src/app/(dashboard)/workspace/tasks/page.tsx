import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import WorkspaceView from '@/components/workspace/workspace-view';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get the current user's ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user:', userError);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to authenticate user. Please try logging in again.</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Please log in to access the workspace.</AlertDescription>
      </Alert>
    );
  }

  // Fetch all projects and tasks in a single query
  const { data: { projects, tasks }, error } = await supabase.rpc('get_workspace_data');

  if (error) {
    console.error('Error fetching workspace data:', error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to load workspace data. Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full">
      <WorkspaceView 
        projects={projects || []}
        initialTasks={tasks || []}
      />
    </div>
  );
}
