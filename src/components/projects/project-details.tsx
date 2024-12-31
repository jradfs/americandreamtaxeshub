'use client'

import { ProjectWithRelations } from "@/types/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Phone, Building, FileText, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

interface ProjectDetailsProps {
  project: ProjectWithRelations
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Details about the client associated with this project</CardDescription>
        </CardHeader>
        <CardContent>
          {project.client ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={project.client.avatar_url} />
                  <AvatarFallback>{project.client.full_name?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.client.full_name}</div>
                  {project.client.company_name && (
                    <div className="text-sm text-muted-foreground">{project.client.company_name}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {project.client.contact_info?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <Link href={`mailto:${project.client.contact_info.email}`} className="text-primary hover:underline">
                      {project.client.contact_info.email}
                    </Link>
                  </div>
                )}
                {project.client.contact_info?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <Link href={`tel:${project.client.contact_info.phone}`} className="text-primary hover:underline">
                      {project.client.contact_info.phone}
                    </Link>
                  </div>
                )}
                {project.client.contact_info?.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    <span>{project.client.contact_info.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${project.client.id}`}>
                    View Client Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No client associated with this project
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Important dates and project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              {project.start_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Started: {format(new Date(project.start_date), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {project.due_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Due: {format(new Date(project.due_date), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {project.template_id && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>Created from template</span>
                </div>
              )}
            </div>

            {project.description && (
              <div className="pt-4">
                <div className="text-sm font-medium">Description</div>
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
              </div>
            )}

            {project.links && (
              <div className="pt-4">
                <div className="text-sm font-medium mb-2">Related Links</div>
                <div className="space-y-2">
                  {project.links.map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4" />
                      <Link href={link.url} target="_blank" className="text-primary hover:underline">
                        {link.title || link.url}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Overview of task completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(project.completion_percentage || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {project.tasks?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Task Status</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{project.tasks?.filter(t => t.status === 'completed').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>{project.tasks?.filter(t => t.status === 'in_progress').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Todo</span>
                  <span>{project.tasks?.filter(t => t.status === 'todo').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blocked</span>
                  <span>{project.tasks?.filter(t => t.status === 'blocked').length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex -space-x-2">
            {Array.from(new Set(project.tasks?.map(t => t.assignee_id))).map((assigneeId, i) => {
              const task = project.tasks?.find(t => t.assignee_id === assigneeId)
              if (!task?.assignee) return null
              return (
                <Avatar key={assigneeId} className="border-2 border-background">
                  <AvatarImage src={task.assignee.avatar_url} />
                  <AvatarFallback>{task.assignee.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}