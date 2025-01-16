"use client";

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Card } from "./card";

interface DataPoint {
  date: Date;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  className?: string;
  pathClassName?: string;
  title?: string;
  description?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  strokeColor?: string;
  showGrid?: boolean;
  height?: number;
  formatTooltipValue?: (value: number) => string;
  formatYAxis?: (value: number) => string;
}

export function LineChart({
  data,
  className,
  pathClassName,
  title,
  description,
  yAxisLabel,
  xAxisLabel,
  strokeColor = "#0ea5e9",
  showGrid = true,
  height = 400,
  formatTooltipValue = (value: number) => value.toString(),
  formatYAxis = (value: number) => value.toString(),
}: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = data.map((point) => ({
    date: point.date,
    value: point.value,
  }));

  return (
    <Card className={cn("p-6", className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div style={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/20"
              />
            )}
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              className="text-sm text-muted-foreground"
            />
            <YAxis
              tickFormatter={formatYAxis}
              className="text-sm text-muted-foreground"
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          {format(
                            new Date(payload[0].payload.date),
                            "MMM d, yyyy",
                          )}
                        </span>
                        <span className="font-bold">
                          {formatTooltipValue(payload[0].value as number)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
              className={cn("opacity-75", pathClassName)}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
