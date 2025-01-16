"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TaskQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Queue</CardTitle>
        <CardDescription>Your upcoming and pending tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Review Q1 Financial Statements
              </p>
              <p className="text-sm text-muted-foreground">Due in 2 days</p>
            </div>
            <Badge>High Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Prepare Tax Returns for Smith Co
              </p>
              <p className="text-sm text-muted-foreground">Due in 5 days</p>
            </div>
            <Badge variant="secondary">Medium Priority</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Client Meeting: ABC Corp
              </p>
              <p className="text-sm text-muted-foreground">Tomorrow at 2 PM</p>
            </div>
            <Badge variant="outline">Low Priority</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
