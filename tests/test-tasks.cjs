const assert = require('assert');
async function fetch(...args) {
  return import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const API_URL = 'http://localhost:3000/api/tasks';

async function testGetTasks() {
  const response = await fetch(API_URL);
  assert.strictEqual(response.status, 200, 'GET /api/tasks should return 200');
  const data = await response.json();
  assert(Array.isArray(data), 'GET /api/tasks should return an array');
  console.log('GET /api/tasks test passed');
}

async function testPostTask() {
    const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        project_id: 'f90066e3-93bb-4f93-943d-1f63066b60fd',
        due_date: '2025-01-01T00:00:00.000Z',
        status: 'todo',
        priority: 'medium',
        category: 'test'
    };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });
    assert.strictEqual(response.status, 201, 'POST /api/tasks should return 201');
    const data = await response.json();
     assert(Array.isArray(data), 'POST /api/tasks should return an array');
    assert(data.length > 0, 'POST /api/tasks should return an array with at least one element');
    console.log('POST /api/tasks test passed');
    return data[0].id;
}

async function testPutTask(id) {
    const updatedTask = {
        id: id,
        title: 'Updated Test Task',
        description: 'Updated Test Description',
        project_id: 'f90066e3-93bb-4f93-943d-1f63066b60fd',
        due_date: '2025-01-02T00:00:00.000Z',
        status: 'in_progress',
        priority: 'high',
        category: 'updated test'
    };
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    });
    assert.strictEqual(response.status, 200, 'PUT /api/tasks should return 200');
    const data = await response.json();
    assert(Array.isArray(data), 'PUT /api/tasks should return an array');
    assert(data.length > 0, 'PUT /api/tasks should return an array with at least one element');
    assert.strictEqual(data[0].title, 'Updated Test Task', 'PUT /api/tasks should update the task title');
    console.log('PUT /api/tasks test passed');
}

async function testDeleteTask(id) {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    assert.strictEqual(response.status, 200, 'DELETE /api/tasks should return 200');
    const data = await response.json();
    assert.strictEqual(data.message, 'Task deleted', 'DELETE /api/tasks should return a success message');
    console.log('DELETE /api/tasks test passed');
}

async function runTests() {
    await testGetTasks();
    const taskId = await testPostTask();
    await testPutTask(taskId);
    await testDeleteTask(taskId);
}

runTests().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
