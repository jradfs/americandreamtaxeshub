import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
    <div className="flex items-center justify-center h-full bg-muted rounded-lg">
      <p className="text-muted-foreground">Projects workspace coming soon!</p>
    </div>
  );
}
