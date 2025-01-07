import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !client) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {client.full_name || client.company_name}</p>
            <p><span className="font-medium">Email:</span> {client.contact_email}</p>
            <p><span className="font-medium">Phone:</span> {(client.contact_info as any)?.phone || 'N/A'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Address:</span> {(client.contact_info as any)?.address || 'N/A'}</p>
            <p><span className="font-medium">City:</span> {(client.contact_info as any)?.city || 'N/A'}</p>
            <p><span className="font-medium">State:</span> {(client.contact_info as any)?.state || 'N/A'}</p>
            <p><span className="font-medium">Zip:</span> {(client.contact_info as any)?.zip || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}