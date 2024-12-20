import { fetchProjectsWithTasks } from 'lib/api.js';

async function test() {
  try {
    const projects = await fetchProjectsWithTasks();
    console.log('Projects:', projects);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();