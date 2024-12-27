import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'received' | 'reviewed';
  due_date: string;
  reminder_sent: boolean;
}

interface DocumentTrackerProps {
  documents: Document[];
  onSendReminder: (documentId: string) => void;
  onStatusChange: (documentId: string, status: string) => void;
}

export function DocumentTracker({
  documents,
  onSendReminder,
  onStatusChange
}: DocumentTrackerProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const handleStatusChange = (documentId: string, status: string) => {
    onStatusChange(documentId, status);
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Document Tracking</h3>
        <Button
          size="sm"
          disabled={selectedDocuments.length === 0}
          onClick={() => {
            selectedDocuments.forEach(id => onSendReminder(id));
            setSelectedDocuments([]);
          }}
        >
          Send Reminder
        </Button>
      </div>

      <div className="space-y-2">
        {documents.map(document => (
          <div key={document.id} className="flex items-center gap-4 p-2 border rounded">
            <Checkbox
              checked={selectedDocuments.includes(document.id)}
              onCheckedChange={(checked) => {
                setSelectedDocuments(prev =>
                  checked
                    ? [...prev, document.id]
                    : prev.filter(id => id !== document.id)
                );
              }}
            />
            <div className="flex-1">
              <div className="font-medium">{document.name}</div>
              <div className="text-sm text-gray-600">
                Due: {new Date(document.due_date).toLocaleDateString()}
              </div>
            </div>
            <select
              value={document.status}
              onChange={(e) => handleStatusChange(document.id, e.target.value)}
              className="p-1 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}