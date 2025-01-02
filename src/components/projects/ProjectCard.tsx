import React from 'react';
import { ProjectWithRelations } from '@/types/projects';

interface ProjectCardProps {
  project: ProjectWithRelations;
  isLoading?: boolean;
}

export function ProjectCard({ project, isLoading = false }: ProjectCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 animate-pulse" data-testid="project-card-skeleton">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  const completedTasks = project.tasks?.filter(task => task.status === 'completed').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm ${
          project.status === 'completed' ? 'bg-green-100 text-green-800' :
          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {project.due_date && (
        <div className="mt-4 text-sm text-gray-600">
          <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
        </div>
      )}

      {project.tax_info && (
        <div className="mt-2 text-sm">
          <span className={`px-2 py-1 rounded ${
            project.tax_info.extension_filed ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {project.tax_info.extension_filed ? 'Extended' : 'No Extension'}
          </span>
        </div>
      )}
    </div>
  );
}
