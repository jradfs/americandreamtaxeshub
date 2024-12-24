'use client';

import { ProjectWithRelations } from "@/types/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";

interface ProjectDialogProps {
  project?: ProjectWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Make changes to your project using the form below."
              : "Create a new project with the form below."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm 
          project={project}
          mode={project ? 'edit' : 'create'}
          onSuccess={() => {
            onSuccess?.();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}