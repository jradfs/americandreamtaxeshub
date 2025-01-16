"use client";

import React from "react";
import { useTaxReturns } from "@/hooks/useTaxReturns";
import { Database } from "@/types/database.types";

type TaxReturn = Database["public"]["Tables"]["tax_returns"]["Row"];

interface TaxReturnListProps {
  initialReturns?: TaxReturn[] | null;
}

export default function TaxReturnList({ initialReturns }: TaxReturnListProps) {
  const { taxReturns, loading, error, updateReturn, deleteReturn } =
    useTaxReturns(initialReturns);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (loading && !taxReturns.length) {
    return <div>Loading tax returns...</div>;
  }

  return (
    <div className="space-y-2">
      {taxReturns.map((taxReturn) => (
        <div
          key={taxReturn.id}
          className="border p-2 rounded shadow-sm flex justify-between"
        >
          <div>
            <p className="font-semibold">Return #{taxReturn.id}</p>
            <p className="text-sm text-gray-600">Status: {taxReturn.status}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() =>
                updateReturn(taxReturn.id, { status: "in_progress" })
              }
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Move to In Progress
            </button>
            <button
              onClick={() => deleteReturn(taxReturn.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => alert("Download tax return")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Download
            </button>
            <button
              onClick={() => alert("Print tax return")}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Print
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
