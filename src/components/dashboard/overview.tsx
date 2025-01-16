"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewProps {
  totalActiveClients: number;
  pendingTaxReturns: number;
  activeProjects: number;
  upcomingDeadlines: number;
}

export function Overview({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
}: OverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Active Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActiveClients}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Tax Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTaxReturns}</div>
          <p className="text-xs text-muted-foreground">
            Not started or gathering documents
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            Todo, in progress, or review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Due within 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
