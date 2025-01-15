'use client';

import React from 'react';
import { useTaxReturns } from '@/hooks/useTaxReturns';
import { Database } from '@/types/database.types';

type TaxReturn = Database['public']['Tables']['tax_returns']['Row'];

interface TaxReturnListProps {
  initialReturns?: TaxReturn[] | null;
}

export default function TaxReturnList({ initialReturns }: TaxReturnListProps) {
  const { taxReturns, loading, error, updateReturn, deleteReturn } = useTaxReturns(initialReturns);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (loading && !taxReturns.length) {
    return <div>Loading tax returns...</div>;
  }

  return (
    <div className="space-y-2">
      {taxReturns.map((taxReturn) => (
        <div key={taxReturn.id} className="border p-2 rounded shadow-sm flex justify-between">
          <div>
            <p className="font-semibold">Return #{taxReturn.id}</p>
            <p className="text-sm text-gray-600">Status: {taxReturn.status}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => updateReturn(taxReturn.id, { status: 'in_review' })}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Move to Review
            </button>
            <button
              onClick={() => deleteReturn(taxReturn.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 