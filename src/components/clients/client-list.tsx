'use client'

import { useState, useEffect, useTransition } from 'react'
import { ColumnManager } from './column-manager'
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

const ALL_COLUMNS = [
  'Name',
  'Company',
  'Contact',
  'Type',
  'Status',
  'Created',
  'Filing Status',
  'Last Filed',
  'Next Deadline',
  'Actions'
]

const COLUMN_STORAGE_KEY = 'client-columns-prefs'

export function ClientList() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Only run this effect in the browser
    if (typeof window === 'undefined') return ALL_COLUMNS
    
    // Try to load from localStorage
    const savedColumns = localStorage.getItem(COLUMN_STORAGE_KEY)
    return savedColumns ? JSON.parse(savedColumns) : ALL_COLUMNS
  })
  const [clients, setClients] = useState<Client[]>([])
  const [isPending, startTransition] = useTransition()
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

    startTransition(() => {
      fetchClients()
    })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading clients...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clients</h2>
        <ColumnManager 
          allColumns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          onColumnToggle={(column) => {
            setVisibleColumns((prev) => {
              const newColumns = prev.includes(column)
                ? prev.filter((c) => c !== column)
                : [...prev, column]
              // Save to localStorage
              localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(newColumns))
              return newColumns
            })
          }}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.includes('Name') && <TableHead>Name</TableHead>}
            {visibleColumns.includes('Company') && <TableHead>Company</TableHead>}
            {visibleColumns.includes('Contact') && <TableHead>Contact</TableHead>}
            {visibleColumns.includes('Type') && <TableHead>Type</TableHead>}
            {visibleColumns.includes('Status') && <TableHead>Status</TableHead>}
            {visibleColumns.includes('Created') && <TableHead>Created</TableHead>}
            {visibleColumns.includes('Filing Status') && <TableHead>Filing Status</TableHead>}
            {visibleColumns.includes('Last Filed') && <TableHead>Last Filed</TableHead>}
            {visibleColumns.includes('Next Deadline') && <TableHead>Next Deadline</TableHead>}
            {visibleColumns.includes('Actions') && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              {visibleColumns.includes('Name') && (
                <TableCell className="font-medium">
                  <div>
                    <div>{client.full_name}</div>
                    <div className="text-sm text-gray-500">{client.contact_info?.phone}</div>
                  </div>
                </TableCell>
              )}
              {visibleColumns.includes('Company') && (
                <TableCell>{client.company_name || '-'}</TableCell>
              )}
              {visibleColumns.includes('Contact') && (
                <TableCell>
                  <div>
                    <div>{client.contact_email}</div>
                    <div className="text-sm text-gray-500">{client.contact_info?.address}</div>
                  </div>
                </TableCell>
              )}
              {visibleColumns.includes('Type') && (
                <TableCell>
                  <Badge variant="outline">
                    {client.type}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes('Status') && (
                <TableCell>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes('Created') && (
                <TableCell>
                  {format(new Date(client.created_at), 'MMM d, yyyy')}
                </TableCell>
              )}
              {visibleColumns.includes('Filing Status') && (
                <TableCell>
                  {client.tax_info?.filing_status || '-'}
                </TableCell>
              )}
              {visibleColumns.includes('Last Filed') && (
                <TableCell>
                  {client.tax_info?.last_filed ? format(new Date(client.tax_info.last_filed), 'MM/dd/yyyy') : '-'}
                </TableCell>
              )}
              {visibleColumns.includes('Next Deadline') && (
                <TableCell>
                  {client.tax_info?.next_deadline ? format(new Date(client.tax_info.next_deadline), 'MM/dd/yyyy') : '-'}
                </TableCell>
              )}
              {visibleColumns.includes('Actions') && (
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
