"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";

interface RevenueCardProps {
  revenue: number;
  percentageChange: number;
  data: number[];
}

export function RevenueCard({
  revenue,
  percentageChange,
  data,
}: RevenueCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          +{percentageChange}% from last month
        </p>
        <div className="h-[80px]">
          <LineChart
            data={data}
            className="h-full w-full"
            pathClassName="stroke-[hsl(var(--chart-1))]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
