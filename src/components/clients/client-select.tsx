"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
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
import { DbClient } from "@/types/clients";

interface ClientSelectProps {
  value?: string;
  onSelect: (value: string) => void;
  clients: DbClient[];
  disabled?: boolean;
}

export function ClientSelect({
  value,
  onSelect,
  clients,
  disabled,
}: ClientSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedClient = React.useMemo(
    () => clients.find((client) => client.id === value),
    [clients, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedClient ? (
            <span>
              {selectedClient.company_name || selectedClient.full_name}
            </span>
          ) : (
            "Select client..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandEmpty>No client found.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.id}
                onSelect={(currentValue) => {
                  onSelect(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {client.company_name || client.full_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
