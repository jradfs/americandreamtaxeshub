import React from 'react';
import { useProjects } from '../../hooks/useProjects';

interface ProjectListProps {
  clientId?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ clientId }) => {
  const { projects, loading, error } = useProjects(clientId);

  console.log('ProjectList component rendered');
  console.log('Projects data:', projects);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProjects = clientId 
    ? projects?.filter(project => project.client_id === clientId)
    : projects;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Projects</h2>
      {filteredProjects?.length === 0 ? (
        <p className="text-muted-foreground">No projects found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredProjects?.map((project) => (
            <li key={project.id} className="p-4 rounded-lg border">
              <h3 className="font-medium">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
