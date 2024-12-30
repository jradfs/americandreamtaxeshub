const assert = require('assert');
async function fetch(...args) {
  return import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const API_URL = 'http://localhost:3000/api/projects';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuamtrbXdtcHhxdmV6cWV4dHhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzU0ODQ3MSwiZXhwIjoyMDQ5MTI0NDcxfQ.7-ejmI0jYP4T-rJ9CBp3VY-7-xdOHUbBXe6OSzkFGl4';

async function testGetProjects() {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  assert.strictEqual(response.status, 200, 'GET /api/projects should return 200');
  const data = await response.json();
  assert(Array.isArray(data), 'GET /api/projects should return an array');
  console.log('GET /api/projects test passed');
}

async function testPostProject() {
  const newProject = {
    name: 'Test Project',
    description: 'Test Description',
    client_id: 'f33d3f90-7632-42c8-9da1-ecdc39444c47',
    due_date: '2025-01-01T00:00:00.000Z'
  };
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify(newProject),
  });
  assert.strictEqual(response.status, 201, 'POST /api/projects should return 201');
  const data = await response.json();
  assert(Array.isArray(data), 'POST /api/projects should return an array');
  assert(data.length > 0, 'POST /api/projects should return an array with at least one element');
  console.log('POST /api/projects test passed');
  return data[0].id;
}

async function testPutProject(id) {
  const updatedProject = {
    id: id,
    name: 'Updated Test Project',
    description: 'Updated Test Description',
    client_id: 'f33d3f90-7632-42c8-9da1-ecdc39444c47',
    due_date: '2025-01-02T00:00:00.000Z'
  };
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify(updatedProject),
  });
  assert.strictEqual(response.status, 200, 'PUT /api/projects should return 200');
  const data = await response.json();
  assert(Array.isArray(data), 'PUT /api/projects should return an array');
  assert(data.length > 0, 'PUT /api/projects should return an array with at least one element');
  assert.strictEqual(data[0].name, 'Updated Test Project', 'PUT /api/projects should update the project name');
  console.log('PUT /api/projects test passed');
}

async function testDeleteProject(id) {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ id }),
  });
  assert.strictEqual(response.status, 200, 'DELETE /api/projects should return 200');
  const data = await response.json();
  assert.strictEqual(data.message, 'Project deleted', 'DELETE /api/projects should return a success message');
  console.log('DELETE /api/projects test passed');
}

async function runTests() {
  try {
    await testGetProjects();
    const projectId = await testPostProject();
    await testPutProject(projectId);
    await testDeleteProject(projectId);
    console.log('All tests passed successfully');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTests();
