'use client';

import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectGroup } from "./project-group";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import { useState, useMemo } from "react";
import { ProjectWithRelations } from "@/types/projects";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, MoreVertical, X, LayoutGrid, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar, AlertTriangle, ClipboardCheck, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { Building2, FileText, MoreHorizontal } from "lucide-react";

export function ProjectList() {
  const { 
    filters,
    updateFilters,
    clearFilters,
    selectedFilter,
    setSelectedFilter,
    groupProjectsByService,
    groupProjectsByDeadline,
    groupProjectsByStatus,
    groupProjectsByClient,
    filterProjects,
    projects,
    loading,
    error,
    refresh,
    bulkUpdateProjects,
    archiveProjects
  } = useProjectManagement();
  
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [view, setView] = useState<string>('deadline');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const viewOptions = [
    { label: 'By Deadline', value: 'deadline' },
    { label: 'By Status', value: 'status' },
    { label: 'By Service', value: 'service' },
    { label: 'By Client', value: 'client' }
  ];

  // Group projects based on selected view
  const groupedProjects = useMemo(() => {
    const filteredProjects = filterProjects(projects);
    
    switch (view) {
      case 'deadline':
        return groupProjectsByDeadline(filteredProjects);
      case 'status':
        return groupProjectsByStatus(filteredProjects);
      case 'service':
        return groupProjectsByService(filteredProjects);
      case 'client':
        return groupProjectsByClient(filteredProjects);
      default:
        return groupProjectsByDeadline(filteredProjects);
    }
  }, [projects, view, filterProjects, groupProjectsByDeadline, groupProjectsByStatus, groupProjectsByService, groupProjectsByClient]);

  const handleEditProject = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refresh();
      setSelectedProjects([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh projects",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      await bulkUpdateProjects(selectedProjects, { 
        status,
        updated_at: new Date().toISOString()
      });
      toast({
        title: "Success",
        description: `Updated ${selectedProjects.length} projects to ${status}`,
      });
      setSelectedProjects([]);
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update projects",
        variant: "destructive",
      });
    }
  };

  const handleBulkArchive = async () => {
    try {
      await archiveProjects(selectedProjects);
      toast({
        title: "Success",
        description: `Archived ${selectedProjects.length} projects`,
      });
      setSelectedProjects([]);
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive projects",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, clients..."
              className="pl-10 h-11"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center border rounded-lg bg-background h-11">
              <Button
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                className="h-11 px-4 rounded-md"
                onClick={() => setViewMode('card')}
              >
                <LayoutGrid className="h-5 w-5 mr-2" />
                <span>Cards</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                className="h-11 px-4 rounded-md"
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5 mr-2" />
                <span>List</span>
              </Button>
            </div>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[180px] h-11">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProjects.length > 0 && (
          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedProjects.length} projects selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusUpdate('completed')}
              >
                Mark Completed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusUpdate('on_hold')}
              >
                Put On Hold
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
              >
                Archive
              </Button>
            </div>
          </div>
        )}
        
        {/* Project Groups */}
        <div className="space-y-8">
          {Object.entries(groupedProjects).map(([groupName, groupProjects]) => (
            <ProjectGroup 
              key={groupName} 
              title={groupName} 
              count={groupProjects.length}
              defaultExpanded={true}
            >
              {viewMode === 'card' ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {groupProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredProjectId(project.id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    >
                      <div className={cn(
                        "absolute left-4 top-4 z-10 transition-all duration-200",
                        (hoveredProjectId === project.id || selectedProjects.includes(project.id)) 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-0 -translate-x-2"
                      )}>
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => handleSelectProject(project.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </div>
                      <ProjectCard
                        project={project}
                        onProjectUpdated={handleRefresh}
                        selected={selectedProjects.includes(project.id)}
                        showHover={hoveredProjectId === project.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {groupProjects.map((project) => (
                    <div
                      key={project.id}
                      className={cn(
                        "group grid items-center grid-cols-[auto,400px,200px,120px,100px,140px,auto] gap-4 px-4 py-2.5 hover:bg-secondary/5 transition-colors relative cursor-pointer",
                        selectedProjects.includes(project.id) && "bg-secondary/5"
                      )}
                      onClick={(e) => {
                        // Only navigate if we didn't click a button or checkbox
                        if (!(e.target as HTMLElement).closest('button, input[type="checkbox"]')) {
                          window.location.href = `/projects/${project.id}`;
                        }
                      }}
                      onMouseEnter={() => setHoveredProjectId(project.id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    >
                      {/* Checkbox */}
                      <div className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity w-4",
                        selectedProjects.includes(project.id) && "opacity-100"
                      )}>
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => handleSelectProject(project.id)}
                          className="h-4 w-4"
                        />
                      </div>

                      {/* Project Name */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          project.status === 'completed' ? "bg-green-500" :
                          project.status === 'in_progress' ? "bg-blue-500" :
                          "bg-slate-300"
                        )} />
                        <span className="font-medium truncate">{project.name}</span>
                      </div>

                      {/* Client */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
                        <span className="truncate">
                          {project.client?.company_name || project.client?.full_name || '-'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className={cn(
                        "text-xs px-2 py-0.5 rounded-full text-center w-24",
                        project.status === 'completed' ? "bg-green-50 text-green-700" :
                        project.status === 'in_progress' ? "bg-blue-50 text-blue-700" :
                        "bg-slate-50 text-slate-700"
                      )}>
                        {project.status === 'completed' ? 'Completed' :
                         project.status === 'in_progress' ? 'In Progress' : 'Todo'}
                      </div>

                      {/* Tasks Progress */}
                      {project.tasks && project.tasks.length > 0 ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
                          <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">-</div>
                      )}

                      {/* Due Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
                        <span>{project.due_date ? formatDistanceToNow(new Date(project.due_date), { addSuffix: true }) : '-'}</span>
                      </div>

                      {/* Actions Menu */}
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/projects/${project.id}`}>View Details</a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ProjectGroup>
          ))}
        </div>
      </div>
    </div>
  );
}