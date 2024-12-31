import { Metadata } from "next";
import { ProjectList } from "@/components/projects/project-list";
import { NewProjectButton } from "@/components/projects/new-project-button";

export const metadata: Metadata = {
  title: "Projects | American Dream Taxes Hub",
  description: "Tax and accounting project management",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  return (
    <div className="container px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active projects
          </p>
        </div>
        <NewProjectButton />
      </div>

      <ProjectList />
    </div>
  );
}