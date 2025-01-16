"use client";

import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProjectListProps {
  clientId?: string;
}

export default function ProjectList({ clientId }: ProjectListProps) {
  const {
    fetchProjects,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
    error,
  } = useProjects();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProjectsData() {
      try {
        setLoading(true);
        if (clientId) {
          setFilters((prev) => ({ ...prev, client_id: clientId }));
        }
        const { projects, count } = await fetchProjects();
        setProjects(projects);
        setTotalCount(count);
      } catch {
        console.error("Error fetching projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjectsData();
  }, [clientId, fetchProjects]);

  const handleSortChange = (column: string) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div>No projects found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => handleFilterChange("service_type", value)}
          value={filters.service_type}
        >
          <option value="">All Services</option>
          <option value="tax_return">Tax Return</option>
          <option value="bookkeeping">Bookkeeping</option>
          <option value="advisory">Advisory</option>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange("status", value)}
          value={filters.status}
        >
          <option value="">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSortChange("name")}
              className="cursor-pointer"
            >
              Name
            </TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead
              onClick={() => handleSortChange("priority")}
              className="cursor-pointer"
            >
              Priority
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              onClick={() => handleSortChange("due_date")}
              className="cursor-pointer"
            >
              Due Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const isOverdue =
              project.due_date && new Date(project.due_date) < new Date();
            return (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-muted-foreground">
                      {project.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>{project.service_type}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      project.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : project.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800",
                    )}
                  >
                    {project.priority}
                  </span>
                </TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <span className={cn(isOverdue && "text-red-600")}>
                    {project.due_date
                      ? formatDistanceToNow(new Date(project.due_date))
                      : "No due date"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {projects.length} of {totalCount} projects
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={projects.length < pagination.pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
