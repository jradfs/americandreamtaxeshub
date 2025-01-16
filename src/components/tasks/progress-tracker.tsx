"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Minus, Plus } from "lucide-react";

interface ProgressTrackerProps {
  progress: number;
  estimatedHours?: number;
  actualHours?: number;
  onProgressChange?: (value: number) => void;
  onActualHoursChange?: (hours: number) => void;
  showTimeTracking?: boolean;
  readOnly?: boolean;
}

export function ProgressTracker({
  progress,
  estimatedHours,
  actualHours,
  onProgressChange,
  onActualHoursChange,
  showTimeTracking = false,
  readOnly = false,
}: ProgressTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  const handleTrackingToggle = () => {
    if (isTracking) {
      // Stop tracking
      if (trackingStartTime && onActualHoursChange) {
        const elapsedHours =
          (new Date().getTime() - trackingStartTime.getTime()) /
          (1000 * 60 * 60);
        onActualHoursChange((actualHours || 0) + elapsedHours);
      }
      setIsTracking(false);
      setTrackingStartTime(null);
    } else {
      // Start tracking
      setIsTracking(true);
      setTrackingStartTime(new Date());
    }
  };

  const adjustActualHours = (increment: boolean) => {
    if (!onActualHoursChange) return;
    const change = increment ? 0.5 : -0.5;
    const newHours = Math.max(0, (actualHours || 0) + change);
    onActualHoursChange(newHours);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {readOnly ? (
            <Progress value={progress} className="h-2" />
          ) : (
            <Slider
              value={[progress]}
              onValueChange={([value]) => onProgressChange?.(value)}
              max={100}
              step={5}
              className="h-2"
            />
          )}
        </div>
        <div className="w-12 text-sm text-muted-foreground">{progress}%</div>
      </div>

      {showTimeTracking && (
        <div className="flex items-center gap-2 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {actualHours?.toFixed(1) || 0}/{estimatedHours || 0}h
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Actual / Estimated Hours</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!readOnly && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustActualHours(false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustActualHours(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant={isTracking ? "destructive" : "secondary"}
                size="sm"
                onClick={handleTrackingToggle}
              >
                {isTracking ? "Stop" : "Start"} Timer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
