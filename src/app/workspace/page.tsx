'use client';

import { useState } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFiltersWrapper } from "@/components/projects/project-filters-wrapper";
import { NewProjectButton } from "@/components/projects/new-project-button";

export const metadata: Metadata = {
  title: "Workspace | American Dream Taxes Hub",
  description: "Tax and accounting project management",
};

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(id, name, company_name),
      tasks:tasks(id, status)
    `)
    .order("created_at", { ascending: false });

  const { data: totalProjects } = await supabase
    .from("projects")
    .select("id", { count: "exact" });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company_name");

  const clientOptions = clients?.map(client => ({
    id: client.id,
    label: client.company_name || client.name
  })) || [];

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage {totalProjects?.length} active projects
          </p>
        </div>
        <NewProjectButton />
      </div>

      <ProjectFiltersWrapper clientOptions={clientOptions} />

      <div className="grid gap-6 mt-6">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}