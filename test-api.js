import { fetchProjectsWithTasks, createProject, fetchTasksByProject, createTasks, applyTemplate } from '/mnt/c/Users/jr/CascadeProjects/american-dream-taxes-hub/src/lib/api.js';

async function main() {
  console.log('Testing API functions...');

  // Test fetchProjectsWithTasks
  console.log('Fetching projects with tasks...');
  const projectsWithTasks = await fetchProjectsWithTasks();
  console.log('Projects with tasks:', JSON.stringify(projectsWithTasks, null, 2));

  // Test createProject
  console.log('Creating a new project...');
  const newProject = await createProject({ name: 'Test Project', status: 'pending' });
  console.log('New project:', JSON.stringify(newProject, null, 2));

    // Test fetchTasksByProject
  if (newProject && newProject.id) {
    console.log('Fetching tasks for the new project...');
    const tasks = await fetchTasksByProject(newProject.id);
    console.log('Tasks for the new project:', JSON.stringify(tasks, null, 2));
  }

  // Test createTasks
  console.log('Creating new tasks...');
  const newTasks = await createTasks([
    { title: 'Task 1', status: 'todo', project_id: newProject.id },
    { title: 'Task 2', status: 'in progress', project_id: newProject.id },
  ]);
  console.log('New tasks:', JSON.stringify(newTasks, null, 2));

  // Test applyTemplate
  console.log('Applying a template...');
  const templateTasks = await applyTemplate('1', { name: 'Template Project', status: 'pending' });
  console.log('Template tasks:', JSON.stringify(templateTasks, null, 2));
}

main().catch(error => console.error('Error during API testing:', error));