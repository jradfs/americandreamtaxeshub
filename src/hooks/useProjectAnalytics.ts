import { useCallback, useState } from 'react';
import { ProjectWithRelations } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useProjectAnalytics() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  const analyzeProjects = useCallback(async (projects: ProjectWithRelations[]) => {
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