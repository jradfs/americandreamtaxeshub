import { getServerClient } from "@/lib/supabase/server-client";
import type { Database } from "@/types/database.types";

type TaxReturnStatus = Database["public"]["Enums"]["tax_return_status"];
type ProjectStatus = Database["public"]["Enums"]["project_status"];
type ClientStatus = Database["public"]["Enums"]["client_status"];

export async function getDashboardMetrics() {
  const supabase = getServerClient();

  try {
    // Get client metrics with onboarding progress
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, status, onboarding_progress")
      .eq("status", "active" satisfies ClientStatus);

    if (clientsError) throw clientsError;

    const onboardingStats =
      clients?.reduce(
        (acc, client) => {
          const progress = client.onboarding_progress as {
            status: string;
            completed_steps: string[];
          };
          const status = progress?.status || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    // Get tax returns with status distribution
    const { data: taxReturns, error: taxReturnsError } = await supabase
      .from("tax_returns")
      .select("id, status, total_amount, paid_amount");

    if (taxReturnsError) throw taxReturnsError;

    const taxReturnStats = taxReturns?.reduce(
      (acc, tr) => {
        acc.count[tr.status] = (acc.count[tr.status] || 0) + 1;
        acc.totalAmount += tr.total_amount || 0;
        acc.pendingAmount += (tr.total_amount || 0) - (tr.paid_amount || 0);
        return acc;
      },
      { count: {}, totalAmount: 0, pendingAmount: 0 } as {
        count: Record<string, number>;
        totalAmount: number;
        pendingAmount: number;
      },
    ) || { count: {}, totalAmount: 0, pendingAmount: 0 };

    // Get project metrics with status and progress
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, status, workflow_state");

    if (projectsError) throw projectsError;

    const projectStats =
      projects?.reduce(
        (acc, project) => {
          acc[project.status] = (acc[project.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    // Get task metrics with deadlines
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, status, due_date")
      .gte("due_date", new Date().toISOString())
      .lte(
        "due_date",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("due_date", { ascending: true });

    if (tasksError) throw tasksError;

    const taskStats = tasks?.reduce(
      (acc, task) => {
        acc.statusCount[task.status] = (acc.statusCount[task.status] || 0) + 1;
        if (task.due_date) {
          acc.upcomingDeadlines.push({
            id: task.id,
            due_date: task.due_date,
          });
        }
        return acc;
      },
      {
        statusCount: {} as Record<string, number>,
        upcomingDeadlines: [] as Array<{ id: string; due_date: string }>,
      },
    ) || { statusCount: {}, upcomingDeadlines: [] };

    return {
      activeClients: clients?.length || 0,
      onboardingProgress: onboardingStats,
      taxReturns: {
        statusDistribution: taxReturnStats.count,
        financials: {
          totalAmount: taxReturnStats.totalAmount,
          pendingAmount: taxReturnStats.pendingAmount,
        },
      },
      projects: {
        statusDistribution: projectStats,
      },
      tasks: {
        statusDistribution: taskStats.statusCount,
        upcomingDeadlines: taskStats.upcomingDeadlines,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
}
