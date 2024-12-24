import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectTasks } from "@/components/projects/project-tasks";
import { ProjectDetails } from "@/components/projects/project-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: project ? `${project.name} | American Dream Taxes Hub` : "Project Not Found",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    // First fetch the project data with client info
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info
        )
      `)
      .eq("id", params.id)
      .single();

    if (projectError) {
      console.error("Error fetching project:", projectError);
      throw projectError;
    }

    if (!project) {
      notFound();
    }

    // Fetch tasks for this project without trying to join profiles yet
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        start_date,
        progress,
        estimated_hours,
        actual_hours,
        assignee_id,
        tax_return_id,
        parent_task_id,
        tax_form_type,
        activity_log,
        checklist,
        recurring_config,
        created_at,
        updated_at
      `)
      .eq("project_id", project.id)
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    // Process and combine the data
    const processedProject = {
      ...project,
      tasks: tasks || [],
      completion_percentage: tasks && tasks.length > 0 ? 
        (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0
    };

    return (
      <div className="container py-6">
        <ProjectHeader project={processedProject} />
        
        <Tabs defaultValue="tasks" className="mt-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-4">
            <ProjectTasks project={processedProject} />
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <ProjectDetails project={processedProject} />
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error in ProjectPage:", error);
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertDescription>
            There was a problem loading the project. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}