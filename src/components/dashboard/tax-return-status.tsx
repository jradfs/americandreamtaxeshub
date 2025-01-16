"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function TaxReturnStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tax-return-status"],
    queryFn: async () => {
      const { data, error } = await supabaseBrowserClient.rpc(
        "get_tax_return_status",
      );

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Return Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Return Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center space-y-4">
          <p className="text-red-500 text-center">
            Unable to load tax return status data.
            {error instanceof Error ? ` (${error.message})` : ""}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Return Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
