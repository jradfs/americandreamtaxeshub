import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  const supabase = getSupabaseServerClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <div className="text-sm text-gray-600">
              <p>Status: {project.status}</p>
              <p>Due Date: {project.due_date || "N/A"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
