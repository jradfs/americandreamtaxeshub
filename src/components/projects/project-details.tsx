"use client";

import type { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Calendar, Clock, Mail, Phone, Building, FileText } from "lucide-react";
import Link from "next/link";

type DbProject = Database["public"]["Views"]["project_dashboard"]["Row"];

interface ProjectDetailsProps {
  project: DbProject;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  if (!project) return <div>No project data available</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Details about the client associated with this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.client_name ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {project.client_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.client_name}</div>
                  {project.company_name && (
                    <div className="text-sm text-muted-foreground">
                      {project.company_name}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${project.id}`}>
                    View Client Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No client associated with this project
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Important dates and project information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  Due:{" "}
                  {project.due_date
                    ? format(new Date(project.due_date), "MMMM d, yyyy")
                    : "No due date"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>
                  Service Type:{" "}
                  {project.service_type?.replace("_", " ") || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Overview of task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(project.completion_percentage || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Progress
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {project.total_tasks || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Task Status</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{project.completed_tasks || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {project.assigned_team_members ? (
              <span className="text-sm">{project.assigned_team_members}</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No team members assigned
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
