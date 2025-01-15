import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';

export default function ClientManagementPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients();
  const [newClientName, setNewClientName] = useState('');

  async function handleCreate() {
    if (newClientName.trim()) {
      await createClient({ name: newClientName });
      setNewClientName('');
    }
  }

  return (
    <div>
      <h1>Client Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Add New Client</h2>
        <input
          placeholder="Client Name"
          value={newClientName}
          onChange={e => setNewClientName(e.target.value)}
        />
        <button onClick={handleCreate}>Create Client</button>
      </div>

      <div>
        <h2>Existing Clients</h2>
        {clients.map(client => (
          <div key={client.id} style={{ border: '1px solid #ccc', margin: '6px 0', padding: '6px' }}>
            <strong>ID:</strong> {client.id} <br />
            <strong>Name:</strong> {client.name} <br />
            <button onClick={() => updateClient(client.id, { name: client.name + ' (Updated)' })}>
              Update
            </button>
            <button onClick={() => deleteClient(client.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 