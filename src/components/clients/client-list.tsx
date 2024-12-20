import { useClients } from 'src/hooks/useClients';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { PlusCircle } from "lucide-react"
import { ClientDialog } from "./client-dialog"
import { useState } from "react"
import { Client } from 'src/types/hooks';

export function ClientList() {
  const { clients, loading, error } = useClients()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.full_name}</TableCell>
              <TableCell>{client.company_name}</TableCell>
              <TableCell>{client.contact_email}</TableCell>
              <TableCell>{client.type}</TableCell>
              <TableCell>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedClient(client)
                    setIsDialogOpen(true)
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
        onClose={() => {
          setSelectedClient(null)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}
