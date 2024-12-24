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
import { useProjectTemplates } from "@/hooks/useProjectTemplates";
import { Badge } from "@/components/ui/badge";

interface TemplateComboboxProps {
  value?: string;
  onChange: (value: string) => void;
}

export function TemplateCombobox({ value, onChange }: TemplateComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { templates } = useProjectTemplates();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? templates?.find((template) => template.id === value)?.title
            : "Select template..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search templates..." />
          <CommandEmpty>No template found.</CommandEmpty>
          <CommandGroup>
            {templates?.map((template) => (
              <CommandItem
                key={template.id}
                value={template.title}
                onSelect={() => {
                  onChange(template.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === template.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{template.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {template.description}
                  </span>
                </div>
                <Badge className="ml-auto">{template.category}</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}