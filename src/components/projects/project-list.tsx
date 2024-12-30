'use client';

import { ProjectCard } from "./project-card";
import { ProjectTable } from "./project-table";
import { ProjectDialog } from "./project-dialog";
import { useProjectManagement } from "@/hooks/useProjectManagement";
import { useState, useMemo } from "react";
import { ProjectWithRelations } from "@/types/projects";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

export function ProjectList() {
  const { 
    view,
    setView,
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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { toast } = useToast();

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

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects.length === projects.length 
        ? [] 
        : projects.map(p => p.id)
    );
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
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

  const viewOptions = [
    { label: 'By Service', value: 'service' },
    { label: 'By Deadline', value: 'deadline' },
    { label: 'By Status', value: 'status' },
    { label: 'By Client', value: 'client' }
  ];

  const quickFilters = [
    {
      label: 'Due This Week',
      value: 'dueThisWeek',
      icon: Calendar,
      filter: { dueThisWeek: true }
    },
    {
      label: 'Missing Info',
      value: 'missingInfo',
      icon: AlertTriangle,
      filter: { missingInfo: true }
    },
    {
      label: 'Needs Review',
      value: 'needsReview',
      icon: ClipboardCheck,
      filter: { needsReview: true }
    },
    {
      label: 'High Priority',
      value: 'highPriority',
      icon: AlertCircle,
      filter: { priority: 'high' }
    }
  ];

  // Group and sort projects
  const sortedProjects = useMemo(() => {
    let sorted = [...(projects || [])];
    if (sortConfig) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof ProjectWithRelations];
        let bValue = b[sortConfig.key as keyof ProjectWithRelations];

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle dates
        if (sortConfig.key === 'due_date') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const result = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? result : -result;
      });
    }
    return sorted;
  }, [projects, sortConfig]);

  // Group projects based on current view
  const groupedProjects = useMemo(() => {
    if (!projects?.length) return {
      'No Projects': []
    };
    
    const filteredProjects = filterProjects(sortedProjects);
    
    switch (view) {
      case 'service':
        return groupProjectsByService(filteredProjects);
      case 'deadline':
        return groupProjectsByDeadline(filteredProjects);
      case 'status':
        return groupProjectsByStatus(filteredProjects);
      case 'client':
        return groupProjectsByClient(filteredProjects);
      default:
        return { 'All Projects': filteredProjects };
    }
  }, [view, sortedProjects, filterProjects, groupProjectsByService, groupProjectsByDeadline, groupProjectsByStatus, groupProjectsByClient]);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/50 p-4">
          <p className="text-sm text-destructive">Failed to load projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Search and View Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, clients..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Select value={view} onValueChange={(v: any) => setView(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
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
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg overflow-x-auto">
          {quickFilters.map(filter => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                if (selectedFilter === filter.value) {
                  setSelectedFilter(null);
                  clearFilters();
                } else {
                  setSelectedFilter(filter.value);
                  updateFilters(filter.filter);
                }
              }}
            >
              <filter.icon className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          ))}
          {selectedFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFilter(null);
                clearFilters();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
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
      </div>

      {/* Project Display */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[250px] rounded-lg border border-muted bg-muted/10 animate-pulse"
            />
          ))}
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={Object.values(groupedProjects).flat()}
          selectedProjects={selectedProjects}
          onSelectProject={handleSelectProject}
          onSelectAll={handleSelectAll}
          onEdit={handleEditProject}
          onStatusChange={handleBulkStatusUpdate}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProjects).map(([group, groupProjects]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {group} ({groupProjects.length})
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupProjects.map((project) => (
                  <div key={project.id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProjects([...selectedProjects, project.id]);
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                          }
                        }}
                      />
                    </div>
                    <ProjectCard
                      project={project}
                      onEdit={handleEditProject}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectDialog
            project={editingProject}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={() => {
              setDialogOpen(false);
              refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}