'use client';

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ClientComboboxProps {
  value?: string | null;
  onChange: (value: string | null) => void;
}

interface Client {
  id: string;
  full_name: string | null;
  company_name: string | null;
  type: 'business' | 'individual';
}

export function ClientCombobox({ value, onChange }: ClientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClientComponentClient();

  React.useEffect(() => {
    async function loadClients() {
      const { data } = await supabase
        .from('clients')
        .select('id, full_name, company_name, type')
        .order('type')
        .order('company_name', { nullsLast: true })
        .order('full_name', { nullsLast: true });
      
      setClients(data || []);
      setLoading(false);
    }

    loadClients();
  }, [supabase]);

  const selected = React.useMemo(() => 
    clients.find(client => client.id === value),
    [clients, value]
  );

  const getDisplayName = (client: Client) => {
    if (client.type === 'business' && client.company_name) {
      return client.company_name;
    }
    return client.full_name || 'Unnamed Client';
  };

  if (loading) {
    return <Button variant="outline" className="w-full justify-between">Loading clients...</Button>;
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
          {selected ? getDisplayName(selected) : "Select a client..."}
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
                value={getDisplayName(client)}
                onSelect={() => {
                  onChange(client.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {getDisplayName(client)}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({client.type})
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}