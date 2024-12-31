import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectTasks } from "@/components/projects/project-tasks";
import { ProjectDetails } from "@/components/projects/project-details";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const params = await props.params;
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: project ? `${project.name} | American Dream Taxes Hub` : "Project Not Found",
  };
}

export default async function ProjectPage(props: Props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    const params = await props.params;
    const searchParams = await props.searchParams;

    // Fetch project with comprehensive details
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

    // Detailed error handling for project fetch
    if (projectError) {
      console.error("Project fetch error:", projectError);
      return (
        <div className="container py-6">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <AlertTitle>Project Load Error</AlertTitle>
            <AlertDescription>
              {projectError.code === 'PGRST116' 
                ? "The project you're looking for does not exist." 
                : "Unable to load project details. Please check your connection or permissions."}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Handle case where no project is found
    if (!project) {
      return notFound();
    }

    // Fetch tasks for this project
    let tasks = [];
    const { data: tasksData, error: tasksError } = await supabase
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
        assignee_id,
        project_id,
        created_at,
        updated_at
      `)
      .eq("project_id", project.id)
      .order('created_at', { ascending: false });

    // Detailed error handling for tasks fetch
    if (tasksError) {
      console.error("Tasks fetch error:", {
        message: tasksError.message,
        code: tasksError.code,
        details: tasksError.details,
        hint: tasksError.hint
      });
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }
    tasks = tasksData || [];

    // Compute project completion percentage
    const completionPercentage = tasks && tasks.length > 0 
      ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
      : 0;

    const processedProject = {
      ...project,
      tasks: tasks || [],
      completion_percentage: completionPercentage
    };

    return (
      <div className="container py-6">
        {/* Project Header with safety check */}
        {processedProject && <ProjectHeader project={processedProject} />}
        
        <Tabs defaultValue="tasks" className="mt-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="details">Project Details</TabsTrigger>
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
    console.error("Unexpected error in ProjectPage:", error);
    return (
      <div className="container py-6">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <AlertTitle>Unexpected Error</AlertTitle>
          <AlertDescription>
            An unexpected error occurred while loading the project. 
            Please try again later or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}