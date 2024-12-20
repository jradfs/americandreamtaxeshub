import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ProjectList from 'src/components/projects/project-list';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
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

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your tax projects</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            New Project
          </button>
        </div>

        {/* Project Grid */}
        <ProjectList />

        {/* Load More */}
        <div className="flex justify-center">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
