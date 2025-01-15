import React, { useState, useEffect } from 'react';
import { storageClient as supabase } from '@/lib/storage/index';
import { handleError } from '@/lib/error-handler';
import { uploadFileToStorage } from '@/lib/storage/index';

type DocumentStatus = 'uploaded' | 'review' | 'approved' | 'rejected';

interface DocumentRecord {
  id: number;
  file_name: string;
  file_path: string;
  document_status: DocumentStatus;
}

export default function DocumentCenterPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*');
      if (error) throw error;
      if (data) {
        setDocuments(data as DocumentRecord[]);
      }
    } catch (err: any) {
      setError(handleError(err).message);
    }
  }

  async function handleUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    if (!evt.target.files) return;
    setUploading(true);

    try {
      const file = evt.target.files[0];
      // Use our custom storage service
      const storageResult = await uploadFileToStorage(file);
      if (!storageResult.filePath) throw new Error('Upload failed');

      // Insert record in 'documents' table
      const { error: docErr } = await supabase
        .from('documents')
        .insert({
          file_name: file.name,
          file_path: storageResult.filePath,
          document_status: 'uploaded',
        });
      if (docErr) throw docErr;

      await fetchDocuments();
    } catch (err: any) {
      setError(handleError(err).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1>Document Center</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Upload Document: </label>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>

      <h2>Documents</h2>
      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            border: '1px solid #ccc',
            margin: '6px 0',
            padding: '6px',
          }}
        >
          <p>File Name: {doc.file_name}</p>
          <p>File Path: {doc.file_path}</p>
          <p>Status: {doc.document_status}</p>
        </div>
      ))}
    </div>
  );
}
