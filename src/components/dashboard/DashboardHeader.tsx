import { getServerClient } from "@/lib/supabase/server-client";

export async function DashboardHeader() {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.user_metadata?.full_name || user?.email}
      </h1>
    </div>
  );
}
