'use client';

import React from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Database } from '@/types/database.types';

type Document = Database['public']['Tables']['documents']['Row'];

interface DocumentListProps {
  initialDocuments?: Document[] | null;
}

export default function DocumentList({ initialDocuments }: DocumentListProps) {
  const { documents, loading, error, updateDocument, deleteDocument } = useDocuments(initialDocuments);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (loading && !documents.length) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <div key={document.id} className="border p-2 rounded shadow-sm flex justify-between">
          <div>
            <p className="font-semibold">{document.file_name}</p>
            <p className="text-sm text-gray-600">Status: {document.status}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => updateDocument(document.id, { status: 'processed' })}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Mark Processed
            </button>
            <button
              onClick={() => deleteDocument(document.id, document.file_path)}
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