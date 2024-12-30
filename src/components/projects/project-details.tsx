'use client'

import { useState, useEffect } from 'react';
import { Button } from "src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Phone, Building, FileText, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { DocumentTracker } from "../workflows/DocumentTracker";
import { useDocuments } from "src/hooks/useDocuments";
import { ProjectWithRelations } from 'src/types/projects';

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<ProjectWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const foundProject = data.find((p: any) => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        } else {
            setError('Project not found');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

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
                  <span>{project.tasks?.filter((t: any) => t.status === 'completed').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>{project.tasks?.filter((t: any) => t.status === 'in_progress').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Todo</span>
                  <span>{project.tasks?.filter((t: any) => t.status === 'todo').length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blocked</span>
                  <span>{project.tasks?.filter((t: any) => t.status === 'blocked').length || 0}</span>
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
            {Array.from(new Set(project.tasks?.map((t: any) => t.assignee_id))).map((assigneeId, i) => {
              const task = project.tasks?.find((t: any) => t.assignee_id === assigneeId);
              if (!task?.assignee) return null;
              
              return task && task.assignee ? (
                <Avatar key={`${assigneeId ?? 'no-assignee'}-${i}`} className="border-2 border-background">
                  <AvatarImage src={task.assignee.avatar_url} />
                  <AvatarFallback>{task.assignee.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Document Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Document Tracking</CardTitle>
          <CardDescription>Track the status of project documents</CardDescription>
        </CardHeader>
        <CardContent>
          {project && (
            <ProjectDocumentTracker project={project} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ProjectDocumentTrackerProps {
  project: ProjectWithRelations;
}

function ProjectDocumentTracker({ project }: ProjectDocumentTrackerProps) {
  const { documents, loading, error, refreshDocuments } = useDocuments(undefined, Number(project.id));

  const handleSendReminder = (documentId: string) => {
    console.log('send reminder', documentId)
    // try {
    //   await supabase
    //     .from('client_documents')
    //     .update({ reminder_sent: true })
    //     .eq('id', documentId);
    //   refreshDocuments();
    // } catch (error) {
    //   console.error('Error sending reminder:', error);
    // }
  };

  const handleStatusChange = (documentId: string, status: string) => {
    console.log('status change', documentId, status)
    // try {
    //   await supabase
    //     .from('client_documents')
    //     .update({ status: status })
    //     .eq('id', documentId);
    //   refreshDocuments();
    // } catch (error) {
    //   console.error('Error updating document status:', error);
    // }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error loading documents: {error}</div>;
  }

  return (
    <DocumentTracker
      documents={documents?.map(doc => ({
        id: String(doc.id),
        name: doc.document_name,
        status: doc.status as "received" | "pending" | "reviewed" || 'pending',
        due_date: doc.uploaded_at || new Date().toISOString(),
        reminder_sent: doc.reminder_sent || false
      })) || []}
      onSendReminder={handleSendReminder}
      onStatusChange={handleStatusChange}
    />
  );
}
