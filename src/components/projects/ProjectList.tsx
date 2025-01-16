"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/DataTable";
import { useProjects } from "@/hooks/useProjects";
import { Badge } from "@/components/ui/badge";

const statusColorMap: Record<string, string> = {
  not_started: "bg-slate-500",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  on_hold: "bg-yellow-500",
  cancelled: "bg-red-500",
};

const priorityColorMap: Record<string, string> = {
  low: "bg-slate-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function ProjectList() {
  const router = useRouter();
  const {
    fetchProjects,
    setSorting,
    setFilters,
    setPagination,
    sorting,
    filters,
    pagination,
  } = useProjects();

  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const columns = [
    {
      accessorKey: "name",
      header: "Project Name",
    },
    {
      accessorKey: "service_type",
      header: "Service Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Badge className={statusColorMap[row.original.status]}>
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: any }) => (
        <Badge className={priorityColorMap[row.original.priority]}>
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }: { row: any }) =>
        row.original.due_date
          ? format(new Date(row.original.due_date), "MMM dd, yyyy")
          : "N/A",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/projects/${row.original.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setDeleteProjectId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { projects, count } = await fetchProjects();
    setData(projects);
    setTotalCount(count);
    setIsLoading(false);
  }, [fetchProjects]);

  useEffect(() => {
    loadData();
  }, [loadData, sorting, filters, pagination]);

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;

    try {
      // Implement delete logic here
      await loadData();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeleteProjectId(null);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        onSortingChange={setSorting}
        onFiltersChange={setFilters}
        onPaginationChange={setPagination}
        pageCount={Math.ceil(totalCount / pagination.pageSize)}
        isLoading={isLoading}
      />

      <AlertDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
