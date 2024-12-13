'use client'

import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface LineChartProps {
  data: number[]
  className?: string
  pathClassName?: string
}

export function LineChart({ data, className, pathClassName }: LineChartProps) {
  const chartData = data.map((value, index) => ({ value }))

  return (
    <div className={cn("w-full h-[200px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2}
            dot={false}
            className={cn("opacity-75", pathClassName)}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
