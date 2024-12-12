import { useProjects } from "@/hooks/useProjects"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Clock, ListTodo } from "lucide-react"
import { ProjectDialog } from "./project-dialog"
import { TaskList } from "@/components/tasks/task-list"
import { useState } from "react"
import { Project } from "@/types/hooks"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProjectListProps {
  clientId?: number
}

export function ProjectList({ clientId }: ProjectListProps) {
  const { projects, loading, error } = useProjects(clientId)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                {project.start_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {project.due_date && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="tasks">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <ListTodo className="mr-2 h-4 w-4" />
                      Tasks
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TaskList projectId={project.id} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedProject(project)
                  setIsDialogOpen(true)
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
        clientId={clientId}
        onClose={() => {
          setSelectedProject(null)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'pending':
      return 'outline'
    case 'overdue':
      return 'destructive'
    default:
      return 'secondary'
  }
}
