'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Building2, Calendar, CheckSquare, PencilIcon } from "lucide-react";
import { ProjectWithRelations } from "@/types/projects";

interface ProjectCardProps {
  project: ProjectWithRelations;
  onEdit?: (project: ProjectWithRelations) => void;
}

const statusColors = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-yellow-100 text-yellow-700",
} as const;

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const completedTasks = project.tasks?.filter(t => t.status === "completed").length ?? 0;
  const totalTasks = project.tasks?.length ?? 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(project);
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:border-primary transition-colors group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleEditClick}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {project.client && (
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{project.client.company_name || project.client.full_name}</span>
                </div>
              )}
            </div>
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-muted-foreground">
                <CheckSquare className="h-4 w-4 mr-1" />
                <span>{completedTasks}/{totalTasks} tasks</span>
              </div>
              
              {project.due_date && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Due {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}</span>
                </div>
              )}
            </div>
            
            <div className="text-muted-foreground">
              Created {formatDistanceToNow(new Date(project.created_at))} ago
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}