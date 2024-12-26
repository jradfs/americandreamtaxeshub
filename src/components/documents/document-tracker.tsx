import { useEffect, useState } from 'react';

interface DocumentTrackerProps {
  projectId: string;
}

export default function DocumentTracker({ projectId }: DocumentTrackerProps) {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch(`/api/documents/status?project_id=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    };

    fetchDocuments();
  }, [projectId]);

  const sendReminder = async (documentId: string) => {
    const response = await fetch('/api/documents/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
    });

    if (response.ok) {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, reminder_sent: true } : doc
      ));
    }
  };

  return (
    <div className="space-y-4">
      {documents.map(document => (
        <div key={document.id} className="p-4 border rounded">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{document.document_name}</h3>
              <p className="text-sm text-gray-500">Status: {document.status}</p>
              {document.due_date && (
                <p className="text-sm text-gray-500">
                  Due Date: {new Date(document.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
            {!document.reminder_sent && (
              <button
                onClick={() => sendReminder(document.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Send Reminder
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}