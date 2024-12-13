'use client';

import { Project } from '@/types/database.types';
import { Task } from '@/types/task-management';
import { useState } from 'react';
import TaskList from '../workspace/task-list';

interface ProjectViewProps {
  projects: Project[];
  tasks: Task[];
}

export default function ProjectView({ projects, tasks }: ProjectViewProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(
    projects[0]?.id || null
  );

  const projectTasks = tasks.filter(
    (task) => task.project_id === selectedProject
  );

  return (
    <div className="h-full flex flex-col">
      {/* Project Selection */}
      <div className="mb-6">
        <select
          value={selectedProject || ''}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks */}
      <div className="flex-1">
        {selectedProject ? (
          <TaskList
            tasks={projectTasks}
            groupBy="status"
            onUpdateTask={() => {}} // Implement these functions
            onDeleteTask={() => {}} // as needed
          />
        ) : (
          <div className="text-center text-gray-500">
            No project selected
          </div>
        )}
      </div>
    </div>
  );
}
