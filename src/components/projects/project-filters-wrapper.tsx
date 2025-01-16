"use client";

import { useState } from "react";
import { ProjectFilters as ProjectFiltersComponent } from "@/components/projects/project-filters";
import { ProjectFilters } from "@/hooks/useProjectFilters";

interface ProjectFiltersWrapperProps {
  clientOptions: Array<{ id: string; label: string }>;
}

export function ProjectFiltersWrapper({
  clientOptions,
}: ProjectFiltersWrapperProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: [],
    priority: [],
    service_category: [],
    clientId: "all",
    dateRange: undefined,
    sortBy: "due_date",
    sortOrder: "asc",
    groupBy: "status",
  });

  return (
    <ProjectFiltersComponent
      filters={filters}
      onChange={setFilters}
      clientOptions={clientOptions}
    />
  );
}
