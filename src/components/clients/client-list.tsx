'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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
import { format } from 'date-fns'

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
  }
  created_at: string
  updated_at: string
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setClients(data || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
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
                {format(new Date(client.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}