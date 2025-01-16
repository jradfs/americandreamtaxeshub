import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ClientStatistics } from "@/components/dashboard/client-statistics";
import { TaxReturnStatus } from "@/components/dashboard/tax-return-status";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  let metrics = {
    totalActiveClients: 0,
    pendingTaxReturns: 0,
    activeProjects: 0,
    upcomingDeadlines: 0,
  };

  try {
    const [clientsData, returnsData, projectsData, deadlinesData] =
      await Promise.all([
        supabase
          .from("clients")
          .select("*", { count: "exact" })
          .eq("status", "active"),
        supabase
          .from("tax_returns")
          .select("*", { count: "exact" })
          .eq("status", "pending"),
        supabase
          .from("projects")
          .select("*", { count: "exact" })
          .eq("status", "active"),
        supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .gte("due_date", new Date().toISOString())
          .lte(
            "due_date",
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          ),
      ]);

    metrics = {
      totalActiveClients: clientsData.count || 0,
      pendingTaxReturns: returnsData.count || 0,
      activeProjects: projectsData.count || 0,
      upcomingDeadlines: deadlinesData.count || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-6">
        <DashboardMetrics metrics={metrics} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClientStatistics />
          <TaxReturnStatus />
        </div>
      </div>
    </div>
  );
}
