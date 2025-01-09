'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class TaskErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An error occurred while loading tasks'}
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Try again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
} 