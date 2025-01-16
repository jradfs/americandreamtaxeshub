"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";

interface SubscriptionsCardProps {
  count: number;
  percentageChange: number;
  data: number[];
}

export function SubscriptionsCard({
  count,
  percentageChange,
  data,
}: SubscriptionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <BarChart
            data={data}
            className="h-full w-full"
            pathClassName="fill-[hsl(var(--chart-2))]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
