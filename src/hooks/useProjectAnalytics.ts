import { useCallback, useState } from 'react';
import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Project = Database['public']['Tables']['projects']['Row'];

function calculateCompletionRate(project: Project): number {
  if (!project.task_count || project.task_count === 0) return 0;
  return ((project.completed_tasks || 0) / project.task_count) * 100;
}

function assessProjectRisk(project: Project): string {
  const completionRate = calculateCompletionRate(project);
  if (completionRate < 30) return 'high';
  if (completionRate < 70) return 'medium';
  return 'low';
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
    recommendations.push('Consider allocating more resources to this project');
  }
  if (project.status === 'blocked') {
    recommendations.push('Review and address project blockers');
  }
  if (!project.primary_manager) {
    recommendations.push('Assign a primary manager to improve project oversight');
  }
  
  return recommendations;
}

export function useProjectAnalytics() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const supabase = createClientComponentClient<Database>();

  const analyzeProjects = useCallback(async (projects: Project[]) => {
    setLoading(true);
    try {
      // Analyze project patterns and generate insights
      const projectInsights = projects.map(project => ({
        id: project.id,
        name: project.name,
        metrics: {
          completionRate: calculateCompletionRate(project),
          riskLevel: assessProjectRisk(project),
          predictedDelay: predictDelay(project),
          resourceUtilization: analyzeResourceUtilization(project)
        },
        recommendations: generateRecommendations(project)
      }));

      setInsights(projectInsights);
      return projectInsights;
    } catch (error) {
      console.error('Error analyzing projects:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    insights,
    analyzeProjects
  };
} 