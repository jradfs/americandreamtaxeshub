'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Activity tracking will be implemented in future phases.
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 