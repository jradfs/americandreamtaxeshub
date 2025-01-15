'use client'

import { Progress } from "@/components/ui/progress"
import { useProcessingStatus } from "@/hooks/useProcessingStatus"

function StatusMessage({ status }: { status: string }) {
  switch (status) {
    case 'idle':
      return <p>Ready to process</p>
    case 'processing':
      return <p>Processing document...</p>
    case 'completed':
      return <p>Processing complete</p>
    case 'error':
      return <p>Error processing document</p>
    default:
      return null
  }
}

export function ProcessingStatus({ documentId }: { documentId: string }) {
  const { status, progress } = useProcessingStatus(documentId)
  
  return (
    <div>
      <Progress value={progress} />
      <StatusMessage status={status} />
    </div>
  )
} 