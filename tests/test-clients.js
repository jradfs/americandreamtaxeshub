const assert = require('assert');
async function fetch(...args) {
  return import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const API_URL = 'http://localhost:3000/api/clients';

async function testGetClients() {
  const response = await fetch(API_URL);
  assert.strictEqual(response.status, 200, 'GET /api/clients should return 200');
  const data = await response.json();
  assert(Array.isArray(data), 'GET /api/clients should return an array');
  console.log('GET /api/clients test passed');
}

async function testPostClient() {
    const newClient = {
        full_name: 'Test Client',
        contact_email: 'test@example.com',
        company_name: 'Test Company',
        type: 'LLC',
        status: 'active',
        tax_info: {},
        contact_info: {}
    };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
    });
    assert.strictEqual(response.status, 201, 'POST /api/clients should return 201');
    const data = await response.json();
    assert(Array.isArray(data), 'POST /api/clients should return an array');
    assert(data.length > 0, 'POST /api/clients should return an array with at least one element');
    console.log('POST /api/clients test passed');
    return data[0].id;
}

async function testPutClient(id) {
    const updatedClient = {
        id: id,
        full_name: 'Updated Test Client',
        contact_email: 'updated@example.com',
        company_name: 'Updated Test Company',
         type: 'C-corp',
        status: 'inactive',
        tax_info: {},
        contact_info: {}
    };
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
    });
    assert.strictEqual(response.status, 200, 'PUT /api/clients should return 200');
     const data = await response.json();
    assert(Array.isArray(data), 'PUT /api/clients should return an array');
    assert(data.length > 0, 'PUT /api/clients should return an array with at least one element');
    assert.strictEqual(data[0].full_name, 'Updated Test Client', 'PUT /api/clients should update the client name');
    console.log('PUT /api/clients test passed');
}

async function testDeleteClient(id) {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    assert.strictEqual(response.status, 200, 'DELETE /api/clients should return 200');
    const data = await response.json();
    assert.strictEqual(data.message, 'Client deleted', 'DELETE /api/clients should return a success message');
    console.log('DELETE /api/clients test passed');
}

async function runTests() {
    await testGetClients();
    const clientId = await testPostClient();
    await testPutClient(clientId);
    await testDeleteClient(clientId);
}

runTests().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
