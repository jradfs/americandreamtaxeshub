'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  Mail, 
  FileText, 
  ClipboardList, 
  Trash 
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import format from 'date-fns/format'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Client = {
  id: string
  full_name: string
  company_name: string
  contact_email: string
  status: string
  type: string
  contact_info: {
    phone?: string
    address?: string
  }
  tax_info: {
    tax_id?: string
    filing_status?: string
    last_filed?: string
    next_deadline?: string
  }
  created_at: string
  updated_at: string
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleQuickEmail = (client: Client) => {
    window.location.href = `mailto:${client.contact_email}`
  }

  const handleRequestDocument = (client: Client) => {
    // TODO: Implement document request logic
    console.log('Requesting documents from', client.full_name)
  }

  const handleAddNote = (client: Client) => {
    // TODO: Implement add note logic
    console.log('Adding note for', client.full_name)
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error

      setClients(clients.filter(c => c.id !== clientId))
      toast({
        title: "Client deleted",
        description: "Client was successfully removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Only run this effect in the browser
    if (typeof window === 'undefined') return

    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setClients(data || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading clients...</div>
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Filing Status</TableHead>
            <TableHead>Last Filed</TableHead>
            <TableHead>Next Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{client.full_name}</div>
                  <div className="text-sm text-gray-500">{client.contact_info?.phone}</div>
                </div>
              </TableCell>
              <TableCell>{client.company_name || '-'}</TableCell>
              <TableCell>
                <div>
                  <div>{client.contact_email}</div>
                  <div className="text-sm text-gray-500">{client.contact_info?.address}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {client.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format.default(new Date(client.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {client.tax_info?.filing_status || '-'}
              </TableCell>
              <TableCell>
                {client.tax_info?.last_filed ? format.default(new Date(client.tax_info.last_filed), 'MM/dd/yyyy') : '-'}
              </TableCell>
              <TableCell>
                {client.tax_info?.next_deadline ? format.default(new Date(client.tax_info.next_deadline), 'MM/dd/yyyy') : '-'}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleQuickEmail(client)}>
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRequestDocument(client)}>
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAddNote(client)}>
                  <ClipboardList className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteClient(client.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
