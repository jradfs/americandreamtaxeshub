'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectWithRelations } from "@/types/projects";
import { formatDistanceToNow, isAfter, subDays } from "date-fns";
import { ProjectDialog } from "./project-dialog";
import {
  Building2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Calendar
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ProjectStatus = 'not_started' | 'in_progress' | 'waiting_for_info' | 'needs_review' | 'completed' | 'archived';

interface ProjectCardProps {
  project: ProjectWithRelations;
  onProjectUpdated?: () => void;
  selected?: boolean;
  showHover?: boolean;
  onProjectClick?: () => void;
}

const STATUS_STYLES = {
  'not_started': {
    color: 'bg-secondary',
    badge: 'bg-secondary/5 text-secondary-foreground',
    label: 'Not Started'
  },
  'in_progress': {
    color: 'bg-blue-500',
    badge: 'bg-blue-500/5 text-blue-700',
    label: 'In Progress'
  },
  'waiting_for_info': {
    color: 'bg-yellow-500',
    badge: 'bg-yellow-500/5 text-yellow-700',
    label: 'Waiting for Info'
  },
  'needs_review': {
    color: 'bg-purple-500',
    badge: 'bg-purple-500/5 text-purple-700',
    label: 'Needs Review'
  },
  'completed': {
    color: 'bg-green-500',
    badge: 'bg-green-500/5 text-green-700',
    label: 'Completed'
  },
  'archived': {
    color: 'bg-gray-400',
    badge: 'bg-gray-100/50 text-gray-700',
    label: 'Archived'
  }
} as const;

export function ProjectCard({ project, onProjectUpdated, selected, showHover, onProjectClick }: ProjectCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const status = (project.status as ProjectStatus) in STATUS_STYLES 
    ? (project.status as ProjectStatus) 
    : 'not_started';

  const statusStyle = STATUS_STYLES[status];

  return (
    <>
      <Link href={`/projects/${project.id}`} className="block group">
        <Card className={cn(
          "relative transition-all duration-200 h-[160px]",
          "bg-background dark:bg-card",
          "hover:bg-secondary/5 dark:hover:bg-card/90",
          selected && "ring-2 ring-primary ring-offset-2",
          "text-foreground dark:text-card-foreground"
        )}>
          {/* Status Indicator */}
          <div className={cn(
            "absolute top-0 left-0 w-1 h-full transition-all duration-200",
            statusStyle.color,
            showHover ? "opacity-100" : "opacity-30"
          )} />
          
          <div className="p-4 pl-14 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                {/* Project Title */}
                <h3 className="font-medium text-base truncate mb-1">
                  {project.name}
                </h3>

                {/* Client Info and Status */}
                <div className="flex items-center justify-between gap-2">
                  {project.client && (
                    <div className="flex items-center text-sm text-muted-foreground min-w-0">
                      <Building2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">
                        {project.client.company_name || project.client.full_name}
                      </span>
                    </div>
                  )}
                  
                  {/* Status and Return Type */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.tax_info?.return_type && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] h-5 transition-opacity duration-200",
                          showHover ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {project.tax_info.return_type}
                      </Badge>
                    )}
                    <Badge className={cn(
                      "text-[10px] px-2 h-5 whitespace-nowrap transition-all duration-200",
                      statusStyle.badge,
                      showHover ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                    )}>
                      {statusStyle.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="flex items-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "h-7 w-7 p-0 transition-opacity duration-200",
                        showHover ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
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

            {/* Project Info Section */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Progress Section */}
              {project.tasks && project.tasks.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      {progress === 100 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground">
                        {completedTasks}/{totalTasks} tasks
                      </span>
                    </div>
                    <span className={cn(
                      "font-medium",
                      progress === 100 ? "text-green-500" : "text-muted-foreground"
                    )}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-1 bg-secondary/20 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        progress === 100 ? "bg-green-500/50" : "bg-blue-500/50"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Due Date and Tax Year */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                {project.due_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span className={cn(
                      isDeadlineNear && "text-destructive font-medium"
                    )}>
                      Due {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {project.tax_info?.tax_year && (
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Tax Year {project.tax_info.tax_year}</span>
                  </div>
                )}
              </div>

              {/* Warnings */}
              {project.tax_info?.missing_documents && project.tax_info.missing_documents.length > 0 && (
                <div className={cn(
                  "flex items-center gap-1.5 text-destructive text-xs mt-2",
                  "transition-opacity duration-200",
                  showHover ? "opacity-100" : "opacity-50"
                )}>
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{project.tax_info.missing_documents.length} missing documents</span>
                </div>
              )}
            </div>
          </div>
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
