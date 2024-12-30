'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectWithRelations } from "@/types/projects";
import { formatDistanceToNow, isAfter, subDays } from "date-fns";
import { ProjectDialog } from "./project-dialog";
import {
  Building2,
  Calendar,
  AlertCircle,
  MoreHorizontal,
  FileText
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectWithRelations;
  onProjectUpdated?: () => void;
}

export function ProjectCard({ project, onProjectUpdated }: ProjectCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const statusStyles = {
    'not_started': 'bg-secondary text-secondary-foreground',
    'in_progress': 'bg-blue-100 text-blue-900',
    'waiting_for_info': 'bg-yellow-100 text-yellow-900',
    'needs_review': 'bg-purple-100 text-purple-900',
    'completed': 'bg-green-100 text-green-900',
    'archived': 'bg-destructive/20 text-destructive'
  };

  const priorityStyles = {
    'low': 'border-l-blue-500',
    'medium': 'border-l-yellow-500',
    'high': 'border-l-red-500'
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const isDeadlineNear = project.due_date && 
    isAfter(new Date(), subDays(new Date(project.due_date), 7));

  const completedTasks = project.tasks?.filter(t => t.status === "completed").length ?? 0;
  const totalTasks = project.tasks?.length ?? 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <Link href={`/projects/${project.id}`} className="block">
        <Card className={cn(
          "hover:shadow-md transition-all duration-200 border-l-[3px]",
          priorityStyles[project.priority as keyof typeof priorityStyles]
        )}>
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {project.name}
                  </h3>
                  {project.tax_info?.return_type && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {project.tax_info.return_type}
                    </Badge>
                  )}
                </div>
                {project.client && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 mr-1 opacity-70" />
                    <span>{project.client.company_name || project.client.full_name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    "px-2 py-0.5",
                    statusStyles[project.status as keyof typeof statusStyles]
                  )}
                >
                  {project.status.replace(/_/g, ' ')}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditClick}>
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 opacity-70" />
                  <span className="text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </div>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {project.tax_info?.tax_year && (
                  <Badge variant="outline" className="font-normal">
                    Tax Year {project.tax_info.tax_year}
                  </Badge>
                )}
              </div>
              
              {project.due_date && (
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                  <span className={cn(
                    "text-muted-foreground",
                    isDeadlineNear && "text-destructive font-medium"
                  )}>
                    Due {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            {/* Warnings */}
            {project.tax_info?.missing_documents && project.tax_info.missing_documents.length > 0 && (
              <div className="flex items-center gap-1 text-destructive text-sm border-t pt-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{project.tax_info.missing_documents.length} missing documents</span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      <ProjectDialog
        project={project}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          onProjectUpdated?.();
          setEditDialogOpen(false);
        }}
      />
    </>
  );
}