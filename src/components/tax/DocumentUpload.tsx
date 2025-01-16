"use client";

import { DropZone } from "@/components/shared/DropZone";
import { ProcessingStatus } from "@/components/ai/ProcessingStatus";

function UploadInstructions() {
  return (
    <div className="text-center p-4">
      <p>Drop your tax documents here or click to browse</p>
      <p className="text-sm text-muted-foreground">
        Supported formats: PDF, JPG, PNG
      </p>
    </div>
  );
}

export function DocumentUpload({ taxReturnId }: { taxReturnId: string }) {
  const handleUpload = async (files: FileList) => {
    // Implementation will be handled by the AI processing service
  };

  return (
    <DropZone onDrop={handleUpload}>
      <UploadInstructions />
      <ProcessingStatus documentId={taxReturnId} />
    </DropZone>
  );
}
