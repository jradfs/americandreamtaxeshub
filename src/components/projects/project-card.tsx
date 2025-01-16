"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, isAfter, subDays } from "date-fns";
import { CreateProjectDialog } from "./create-project-dialog";
import {
  Building2,
  Clock,
  FileText,
  MoreHorizontal,
  Users2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database.types";
import { ProjectFormData } from "@/types/projects";
import { useToast } from "@/components/ui/use-toast";

type DbProject = Database["public"]["Views"]["project_dashboard"]["Row"];

interface ProjectCardProps {
  project: DbProject;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const isOverdue = project.due_date
    ? isAfter(new Date(), new Date(project.due_date))
    : false;
  const isDueSoon = project.due_date
    ? isAfter(new Date(project.due_date), new Date()) &&
      isAfter(new Date(project.due_date), subDays(new Date(), 7))
    : false;

  const handleUpdateProject = async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: data.name,
          service_type: data.service_type,
          status: data.status,
        })
        .eq("id", project.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">{project.name}</h3>
          <p className="text-sm text-muted-foreground">
            {project.service_type?.replace("_", " ") || "No service type"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Edit
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(project.id)}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.client_name || "No client assigned"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">
              {project.service_type?.replace("_", " ") || "No service type"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.assigned_team_members || "No team members"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.due_date
                ? formatDistanceToNow(new Date(project.due_date), {
                    addSuffix: true,
                  })
                : "No due date"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            project.status === "completed" && "border-green-500 text-green-500",
            project.status === "in_progress" && "border-blue-500 text-blue-500",
            project.status === "blocked" && "border-red-500 text-red-500",
          )}
        >
          {project.status?.replace("_", " ")}
        </Badge>
        {(isOverdue || isDueSoon) && (
          <Badge
            variant="outline"
            className={cn(
              isOverdue && "border-red-500 text-red-500",
              isDueSoon && "border-yellow-500 text-yellow-500",
            )}
          >
            {isOverdue ? "Overdue" : "Due Soon"}
          </Badge>
        )}
      </CardFooter>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleUpdateProject}
      />
    </Card>
  );
}

ProjectCard.Skeleton = function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-5 w-[100px]" />
      </CardFooter>
    </Card>
  );
};
