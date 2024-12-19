'use client'

import ProjectList from "../../components/projects/project-list"
import { Toaster } from "../../components/ui/toaster"

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your tax projects</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            New Project
          </button>
        </div>

        {/* Project Grid */}
        <ProjectList />

        {/* Load More */}
        <div className="flex justify-center">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            Load More
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
