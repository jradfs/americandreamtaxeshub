'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-white">
              {error.message}
            </pre>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}