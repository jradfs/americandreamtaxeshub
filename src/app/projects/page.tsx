'use client'

import { ProjectList } from "@/components/projects/project-list"
import { Toaster } from "@/components/ui/toaster"

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">2023 Tax Return</div>
                <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">In Progress</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Client: John Doe</div>
                <div className="text-sm text-muted-foreground">Due: Dec 31, 2023</div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    JD
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    +2
                  </div>
                </div>
                <div className="text-muted-foreground">8/12 tasks</div>
              </div>

              <div className="w-full bg-accent/50 rounded-full h-2">
                <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}
