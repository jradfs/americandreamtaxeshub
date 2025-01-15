import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabaseServerClient'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Status:</span> {project.status}</p>
          <p><span className="font-medium">Description:</span> {project.description || 'N/A'}</p>
          <p><span className="font-medium">Due Date:</span> {project.due_date || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
