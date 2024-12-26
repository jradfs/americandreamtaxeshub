'use client';

import { useState } from "react";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectFiltersType } from "@/types/projects";

interface ProjectFiltersWrapperProps {
  clientOptions: Array<{ id: string; label: string }>;
}

export function ProjectFiltersWrapper({ clientOptions }: ProjectFiltersWrapperProps) {
  const [filters, setFilters] = useState<ProjectFiltersType>({
    search: "",
    status: "",
    dateRange: null,
    clientId: "",
  });

  return (
    <ProjectFilters
      filters={filters}
      onChange={setFilters}
      clientOptions={clientOptions}
    />
  );
}
