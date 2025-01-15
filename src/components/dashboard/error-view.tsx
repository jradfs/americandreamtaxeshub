'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface ErrorViewProps {
  title: string
  message: string
}

export function ErrorView({ title, message }: ErrorViewProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p>{message}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="w-fit"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  )
} 