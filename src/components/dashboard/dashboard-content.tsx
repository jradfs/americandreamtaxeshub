"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "@/providers/ApplicationProvider";

export function DashboardContent() {
  const { clients, tasks } = useApplication();

  const metrics = [
    {
      title: "Total Clients",
      value: clients.length,
    },
    {
      title: "Active Tasks",
      value: tasks.filter((t) => t.status !== "completed").length,
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((t) => t.status === "completed").length,
    },
    {
      title: "Urgent Tasks",
      value: tasks.filter((t) => t.priority === "urgent").length,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center space-x-4 py-2"
                >
                  <div>
                    <p className="font-medium">{client.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                </div>
              ))}
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center space-x-4 py-2">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.status}
                    </p>
                  </div>
                </div>
              ))}
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
