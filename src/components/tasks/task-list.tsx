import { useState, useEffect } from 'react';
import { fetchTasksByProject } from 'src/lib/api';

function TaskList({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasksByProject(projectId);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    loadTasks();
  }, [projectId]);

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.status}</p>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
