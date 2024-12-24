'use client';

import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";
import { ProjectFilters } from "./project-filters";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useState } from "react";
import { ProjectWithRelations } from "@/types/projects";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ProjectList() {
  const { filters, updateFilters, projects, loading, error, refresh } = useProjectFilters();
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleEditProject = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refresh();
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

  if (error) {
    return (
      <div className="space-y-4">
        <ProjectFilters
          filters={filters}
          onChange={updateFilters}
        />
        
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectFilters
        filters={filters}
        onChange={updateFilters}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[250px] rounded-lg border border-muted bg-muted/10 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        project={editingProject}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          setEditingProject(undefined);
          refresh();
        }}
      />
    </div>
  );
}