import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectWithRelations } from 'src/types/projects';
import { Task } from 'src/types/tasks';
import Link from 'next/link';

interface ClientPageProps {
  params: { id: string };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const supabase = createClient();
  const { id: clientId } = await params;

  const response = await fetch(`/api/clients`);
  if (!response.ok) {
    notFound();
  }
  const clients = await response.json();
  const client = clients.find((c: any) => c.id === clientId);

  if (!client) {
    notFound();
  }

  const projectsResponse = await fetch(`/api/projects`);
    let projects: ProjectWithRelations[] = [];
    if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        projects = projectsData.filter((p: any) => p.client_id === clientId);
    }

  let tasks: Task[] = [];
  if (projects && projects.length > 0) {
    const tasksResponse = await fetch(`/api/tasks`);
    if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        tasks = tasksData.filter((t: any) => projects.some((p: any) => p.id === t.project_id));
    }
  }


  const openTasks = tasks?.filter((task: Task) => task.status !== 'completed') || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Full Name:</span> {client.full_name}</p>
            {client.company_name && <p><span className="font-medium">Company:</span> {client.company_name}</p>}
            <p><span className="font-medium">Email:</span> {client.contact_email}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
           <div className="space-y-2">
            {client.tax_info && (
              <>
                {client.tax_info.ein && <p><span className="font-medium">EIN:</span> {client.tax_info.ein}</p>}
                {client.tax_info.tax_id && <p><span className="font-medium">Tax ID:</span> {client.tax_info.tax_id}</p>}
              </>
            )}
            {client.contact_info && (
              <>
                {client.contact_info.address && <p><span className="font-medium">Address:</span> {client.contact_info.address}</p>}
                {client.contact_info.city && <p><span className="font-medium">City:</span> {client.contact_info.city}</p>}
                {client.contact_info.state && <p><span className="font-medium">State:</span> {client.contact_info.state}</p>}
                {client.contact_info.zip && <p><span className="font-medium">Zip:</span> {client.contact_info.zip}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Related Projects</h2>
        {projects && projects.length > 0 ? (
          <ul className="list-disc list-inside">
            {projects.map((project: ProjectWithRelations) => (
              <li key={project.id}>
                <Link href={`/projects/${project.id}`} className="text-primary hover:underline">
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects associated with this client.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Open Tasks</h2>
        {openTasks && openTasks.length > 0 ? (
          <ul className="list-disc list-inside">
            {openTasks.map((task: Task) => (
              <li key={task.id}>
                {task.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No open tasks for this client.</p>
        )}
      </div>
    </div>
  )
}
