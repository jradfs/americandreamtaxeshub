'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlayCircle, PauseCircle, StopCircle, Clock } from 'lucide-react';

interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  notes?: string;
}

interface TimeTrackerProps {
  taskId: string;
  onTimeEntry: (entry: Partial<TimeEntry>) => void;
}

export function TimeTracker({ taskId, onTimeEntry }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsTracking(false);
  };

  const handleResume = () => {
    setIsTracking(true);
    // Adjust start time to maintain accurate elapsed time
    if (startTime) {
      const pauseDuration = new Date().getTime() - new Date(startTime).getTime() - (elapsed * 1000);
      setStartTime(new Date(new Date().getTime() - pauseDuration));
    }
  };

  const handleStop = () => {
    setIsTracking(false);
    setShowDialog(true);
  };

  const handleSubmitTime = () => {
    if (startTime) {
      onTimeEntry({
        taskId,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: elapsed,
        notes,
      });
    }
    setShowDialog(false);
    setStartTime(null);
    setElapsed(0);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-mono">{formatTime(elapsed)}</div>
        <div className="space-x-2">
          {!isTracking && elapsed === 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleStart}
              className="text-green-600"
            >
              <PlayCircle className="h-4 w-4" />
            </Button>
          )}
          {isTracking && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePause}
              className="text-yellow-600"
            >
              <PauseCircle className="h-4 w-4" />
            </Button>
          )}
          {!isTracking && elapsed > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleResume}
              className="text-green-600"
            >
              <PlayCircle className="h-4 w-4" />
            </Button>
          )}
          {elapsed > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleStop}
              className="text-red-600"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Time Entry</DialogTitle>
            <DialogDescription>
              Add any notes about the work performed during this time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Time tracked: {formatTime(elapsed)}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you work on?"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTime}>Save Time Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
