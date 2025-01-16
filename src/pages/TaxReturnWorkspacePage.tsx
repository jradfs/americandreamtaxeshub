import React, { useState } from "react";
import { useTaxReturns } from "../hooks/useTaxReturns";
import { handleError } from "../lib/error-handler";
import { createTaskForReturn } from "../lib/services/task.service";

export default function TaxReturnWorkspacePage() {
  const { taxReturns, loading, error, createReturn, updateReturnStatus } =
    useTaxReturns();
  const [newReturnName, setNewReturnName] = useState("");

  async function handleCreate() {
    try {
      if (!newReturnName.trim()) return;
      await createReturn({ name: newReturnName, status: "draft" });
      setNewReturnName("");
    } catch (err: any) {
      console.error(handleError(err).message);
    }
  }

  async function moveToQC(returnId: string) {
    try {
      await updateReturnStatus(returnId, "QC Check");
      // Example: create a QC task in the task service
      await createTaskForReturn(returnId, "QC Review Task");
    } catch (err: any) {
      console.error(handleError(err).message);
    }
  }

  return (
    <div>
      <h1>Tax Return Workspace</h1>
      {loading && <p>Loading Tax Returns...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h2>Create New Return</h2>
        <input
          placeholder="Tax Return Name"
          value={newReturnName}
          onChange={(e) => setNewReturnName(e.target.value)}
        />
        <button onClick={handleCreate}>Create Return</button>
      </div>

      <div>
        <h2>Existing Returns</h2>
        {taxReturns.map((tr) => (
          <div
            key={tr.id}
            style={{
              border: "1px solid #ccc",
              margin: "6px 0",
              padding: "6px",
            }}
          >
            <p>Name: {tr.name}</p>
            <p>Status: {tr.status}</p>
            <button onClick={() => moveToQC(tr.id)}>Move to QC</button>
          </div>
        ))}
      </div>
    </div>
  );
}
