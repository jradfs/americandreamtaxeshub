'use client'

import { Database } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Mail } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectFormData } from "@/types/projects"

type DbProject = Database['public']['Tables']['projects']['Row']
type DbClient = Database['public']['Tables']['clients']['Row']

interface ProjectHeaderProps {
  project: DbProject & {
    client?: DbClient | null
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant={
              project.status === 'completed' ? 'default' :
              project.status === 'in_progress' ? 'secondary' :
              'outline'
            }>
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 text-muted-foreground">
              {project.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {project.client && (
              <Link href={`/clients/${project.client.id}`} className="flex items-center gap-1 hover:text-foreground">
                {project.client.company_name || project.client.full_name}
              </Link>
            )}
            {project.start_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Started {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            {project.due_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Due {format(new Date(project.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {project.client?.contact_email && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`mailto:${project.client.contact_email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email Client
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Project
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-b py-4">
        <div>
          <div className="text-sm font-medium">Status</div>
          <Badge className="mt-1" variant={
            project.status === 'completed' ? 'default' :
            project.status === 'in_progress' ? 'secondary' :
            'outline'
          }>
            {project.status}
          </Badge>
        </div>
        <div>
          <div className="text-sm font-medium">Priority</div>
          <Badge className="mt-1" variant={
            project.priority === 'high' ? 'destructive' :
            project.priority === 'medium' ? 'default' :
            'secondary'
          }>
            {project.priority}
          </Badge>
        </div>
        <div>
          <div className="text-sm font-medium">Progress</div>
          <div className="mt-1 text-2xl font-bold">
            {Math.round(project.completion_percentage || 0)}%
          </div>
        </div>
      </div>

      <CreateProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={async (data: ProjectFormData) => {
          // Handle project update
          console.log('Update project:', data)
        }}
      />
    </div>
  )
}