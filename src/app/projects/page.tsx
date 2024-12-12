'use client'

import { ProjectList } from "@/components/projects/project-list"
import { Toaster } from "@/components/ui/toaster"

export default function ProjectsPage() {
  return (
    <div className="container py-10">
      <ProjectList />
      <Toaster />
    </div>
  )
}
