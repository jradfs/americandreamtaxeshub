'use client'

import React from 'react'
import { getBrowserClient } from '@/lib/supabase/browser-client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Database } from '@/types/database.types'

interface Client {
  id: string
  full_name: string | null
  company_name: string | null
  type: 'business' | 'individual'
}

interface ClientComboboxProps {
  onSelectAction?: (clientId: string) => void;
  onChange?: (clientId: string | null) => void;
  selectedId?: string | null;
  value?: string | null;
}

export function ClientCombobox({ 
  onSelectAction, 
  onChange, 
  selectedId, 
  value 
}: ClientComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [clients, setClients] = React.useState<Client[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = getBrowserClient()

  React.useEffect(() => {
    async function loadClients() {
      const { data } = await supabase
        .from('clients')
        .select('id, full_name, company_name, type')
        .order('type', { ascending: true })
        .order('company_name', { ascending: true })
        .order('full_name', { ascending: true })

      setClients((data || []).filter((client): client is Client => 
        client.type === 'business' || client.type === 'individual'
      ))
      setLoading(false)
    }

    loadClients()
  }, [])

  const selected = React.useMemo(
    () => clients.find(client => client.id === (value ?? selectedId)),
    [clients, value, selectedId]
  )

  const getDisplayName = (client: Client) => {
    if (client.type === 'business' && client.company_name) {
      return client.company_name
    }
    return client.full_name || 'Unnamed Client'
  }

  const handleSelect = (clientId: string) => {
    onSelectAction?.(clientId)
    onChange?.(clientId)
    setOpen(false)
  }

  if (loading) {
    return <Button variant="outline" className="w-full justify-between">Loading clients...</Button>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? getDisplayName(selected) : "Select client..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandEmpty>No client found.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.id}
                onSelect={() => handleSelect(client.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === client.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {getDisplayName(client)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

