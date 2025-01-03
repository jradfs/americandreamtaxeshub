import { useCallback } from 'react';
import { ProjectTemplate } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useSmartTemplates() {
  const supabase = createClientComponentClient();

  const suggestTemplate = useCallback(async (projectData: any) => {
    try {
      // Analyze project requirements and suggest best template
      const analysis = await analyzeProjectRequirements(projectData);
      const recommendations = generateTemplateRecommendations(analysis);
      
      return {
        suggestedTemplate: recommendations.bestMatch,
        alternatives: recommendations.alternatives,
        customizations: recommendations.suggestedCustomizations
      };
    } catch (error) {
      console.error('Error suggesting template:', error);
      return null;
    }
  }, [supabase]);

  return {
    suggestTemplate
  };
} 