'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  ArrowUpDown,
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  Building2,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectWithRelations } from "@/types/projects";
import { cn } from "@/lib/utils";

interface ProjectTableProps {
  projects: ProjectWithRelations[];
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  onSelectAll: () => void;
  onEdit: (project: ProjectWithRelations) => void;
  onStatusChange: (projectId: string, status: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

const statusColors = {
  not_started: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  waiting_for_info: "bg-yellow-100 text-yellow-700",
  needs_review: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-700",
} as const;

const priorityColors = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
} as const;

export function ProjectTable({
  projects,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  onEdit,
  onStatusChange,
  sortConfig,
  onSort,
}: ProjectTableProps) {
  const allSelected = projects.length > 0 && selectedProjects.length === projects.length;
  const someSelected = selectedProjects.length > 0 && selectedProjects.length < projects.length;

  const renderSortButton = (label: string, key: string) => (
    <Button
      variant="ghost"
      onClick={() => onSort(key)}
      className="hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className={cn(
        "ml-2 h-4 w-4",
        sortConfig?.key === key && sortConfig.direction === 'desc' && "rotate-180",
        sortConfig?.key === key && "text-foreground",
        "text-muted-foreground"
      )} />
    </Button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                onCheckedChange={onSelectAll}
                aria-label="Select all projects"
              />
            </TableHead>
            <TableHead>{renderSortButton("Project", "name")}</TableHead>
            <TableHead>{renderSortButton("Client", "client.company_name")}</TableHead>
            <TableHead>{renderSortButton("Service", "category.service")}</TableHead>
            <TableHead>{renderSortButton("Status", "status")}</TableHead>
            <TableHead>{renderSortButton("Due", "due_date")}</TableHead>
            <TableHead>{renderSortButton("Priority", "priority")}</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const isSelected = selectedProjects.includes(project.id);
            const completedTasks = project.tasks?.filter(t => t.status === "completed").length ?? 0;
            const totalTasks = project.tasks?.length ?? 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const hasMissingDocs = project.tax_info?.missing_documents?.length ?? 0 > 0;
            const needsReview = project.tax_info?.review_status === 'needs_review';

            return (
              <TableRow 
                key={project.id} 
                className={cn(
                  isSelected && "bg-muted/50",
                  "hover:bg-muted/30 cursor-pointer transition-colors"
                )}
                onClick={(e) => {
                  // Prevent row click when clicking on buttons or checkboxes
                  if ((e.target as HTMLElement).closest('button, .checkbox-wrapper')) {
                    return;
                  }
                  onEdit(project);
                }}
              >
                <TableCell className="checkbox-wrapper">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectProject(project.id)}
                    aria-label={`Select ${project.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col max-w-[300px]">
                    <div className="font-medium flex items-center gap-2">
                      <span className="truncate">{project.name}</span>
                      {project.tax_info && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {project.tax_info.return_type}
                        </Badge>
                      )}
                    </div>
                    {project.description && (
                      <span className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {hasMissingDocs && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Missing Docs
                        </Badge>
                      )}
                      {needsReview && (
                        <Badge variant="warning" className="text-xs">
                          <ClipboardCheck className="h-3 w-3 mr-1" />
                          Needs Review
                        </Badge>
                      )}
                      {totalTasks > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {completedTasks}/{totalTasks} Tasks
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center max-w-[200px]">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <span className="truncate">{project.client?.company_name || project.client?.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="capitalize">{project.category?.service?.replace(/_/g, ' ')}</span>
                    {project.tax_info && (
                      <span className="text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 inline mr-1" />
                        {project.tax_info.tax_year}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.due_date ? (
                    <div className="flex items-center whitespace-nowrap">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                    {project.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(project)}>
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onStatusChange(project.id, 'completed')}>
                        Mark Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(project.id, 'needs_review')}>
                        Request Review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(project.id, 'waiting_for_info')}>
                        Mark Waiting for Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
