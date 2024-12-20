import { useState } from "react"
import { Play, Pause, Clock } from "lucide-react"
import { Button } from "src/components/ui/button"
import { Card } from "src/components/ui/card"
import { Progress } from "src/components/ui/progress"

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [estimatedTime] = useState(3600) // 1 hour in seconds

  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Time Tracking</span>
        </div>
        <Button
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsTracking(!isTracking)}
        >
          {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{formatTime(elapsedTime)}</span>
          <span>{formatTime(estimatedTime)}</span>
        </div>
        <Progress value={(elapsedTime / estimatedTime) * 100} />
      </div>
    </Card>
  )
}
