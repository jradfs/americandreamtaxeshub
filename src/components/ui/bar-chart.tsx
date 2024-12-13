'use client'

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface BarChartProps {
  data: number[]
  className?: string
  pathClassName?: string
}

export function BarChart({ data, className, pathClassName }: BarChartProps) {
  const chartData = data.map((value, index) => ({ value }))

  return (
    <div className={cn("w-full h-[200px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            className={cn("opacity-75", pathClassName)}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
