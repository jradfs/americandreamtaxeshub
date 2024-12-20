import { useState, useEffect } from 'react';
import { fetchProjectsWithTasks } from 'src/lib/api';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjectsWithTasks();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    loadProjects();
  }, []);

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.status}</p>
          <progress value={project.completed_tasks} max={project.tasks?.length || 0}></progress>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
