import { useCallback, useState, useEffect } from "react";
import { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "@/lib/supabase/dashboardQueries";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface AnalyticsData {
  projectMetrics: {
    totalProjects: number;
    completionRate: number;
    averageDelay: number;
    riskDistribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  taskMetrics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    upcomingDeadlines: number;
  };
  clientMetrics: {
    totalClients: number;
    activeClients: number;
    onboardingStages: Record<string, number>;
  };
  financialMetrics: {
    totalRevenue: number;
    outstandingPayments: number;
  };
}

function calculateCompletionRate(project: Project): number {
  if (!project.task_count || project.task_count === 0) return 0;
  return ((project.completed_tasks || 0) / project.task_count) * 100;
}

function assessProjectRisk(project: Project): string {
  const completionRate = calculateCompletionRate(project);
  if (completionRate < 30) return "high";
  if (completionRate < 70) return "medium";
  return "low";
}

function predictDelay(project: Project): number {
  const completionRate = calculateCompletionRate(project);
  // Simple delay prediction based on completion rate
  if (completionRate < 50) return 5; // 5 days delay predicted
  if (completionRate < 80) return 2; // 2 days delay predicted
  return 0; // No delay predicted
}

function analyzeResourceUtilization(project: Project): number {
  // Simple resource utilization calculation
  const completionRate = calculateCompletionRate(project);
  return Math.min(100, completionRate * 1.2); // Adjust based on completion rate
}

function generateRecommendations(project: Project): string[] {
  const recommendations: string[] = [];
  const completionRate = calculateCompletionRate(project);
  if (completionRate < 30) {
    recommendations.push("Consider allocating more resources to this project");
  }
  if (project.status === "blocked") {
    recommendations.push("Review and address project blockers");
  }
  if (!project.primary_manager) {
    recommendations.push(
      "Assign a primary manager to improve project oversight",
    );
  }

  return recommendations;
}

export function useProjectAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient<Database>();

  const { data: dashboardMetrics, isLoading: isDashboardLoading } = useQuery(
    ["dashboardMetrics"],
    getDashboardMetrics,
  );

  const fetchAnalyticsData = useCallback(async () => {
    try {
      // Fetch projects data
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*");
      if (projectsError) throw projectsError;

      // Fetch tasks data
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*");
      if (tasksError) throw tasksError;

      // Fetch clients data
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("*");
      if (clientsError) throw clientsError;

      // Calculate project metrics
      const projectMetrics = {
        totalProjects: projects.length,
        completionRate:
          projects.reduce(
            (acc, project) => acc + calculateCompletionRate(project),
            0,
          ) / projects.length,
        averageDelay:
          projects.reduce((acc, project) => acc + predictDelay(project), 0) /
          projects.length,
        riskDistribution: projects.reduce(
          (acc, project) => {
            const risk = assessProjectRisk(project);
            acc[risk]++;
            return acc;
          },
          { high: 0, medium: 0, low: 0 },
        ),
      };

      // Calculate task metrics
      const now = new Date();
      const taskMetrics = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.status === "completed")
          .length,
        overdueTasks: tasks.filter(
          (task) =>
            task.due_date &&
            new Date(task.due_date) < now &&
            task.status !== "completed",
        ).length,
        upcomingDeadlines: tasks.filter((task) => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          const diff = dueDate.getTime() - now.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000; // 7 days
        }).length,
      };

      // Calculate client metrics
      const clientMetrics = {
        totalClients: clients.length,
        activeClients: clients.filter((client) => client.status === "active")
          .length,
        onboardingStages: clients.reduce(
          (acc, client) => {
            const stage = client.onboarding_stage || "not_started";
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      // Calculate financial metrics
      const financialMetrics = {
        totalRevenue: projects.reduce(
          (acc, project) => acc + (project.total_amount || 0),
          0,
        ),
        outstandingPayments: projects.reduce(
          (acc, project) =>
            acc + ((project.total_amount || 0) - (project.paid_amount || 0)),
          0,
        ),
      };

      setAnalyticsData({
        projectMetrics,
        taskMetrics,
        clientMetrics,
        financialMetrics,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch analytics data"),
      );
      console.error("Error fetching analytics data:", err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAnalyticsData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  return {
    analyticsData,
    error,
    isLoading: isDashboardLoading || !analyticsData,
    refreshAnalytics: fetchAnalyticsData,
  };
}
