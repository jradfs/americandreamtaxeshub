import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { FormControl, FormLabel, FormMessage, FormItem } from "./form";
import { Database } from "@/types/database.types";

type Status = Database["public"]["Enums"]["task_status"];

interface StatusSelectProps<TFieldValues>
  extends UseControllerProps<TFieldValues> {
  label?: string;
  placeholder?: string;
}

/**
 * Reusable StatusSelect component
 */
export function StatusSelect<TFieldValues>({
  name,
  control,
  label = "Status",
  placeholder = "Select status",
}: StatusSelectProps<TFieldValues>) {
  const { field, fieldState } = useController({ name, control });
  const statusOptions: Status[] = [
    "todo",
    "in_progress",
    "review",
    "completed",
  ];

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Select
          onValueChange={field.onChange}
          value={field.value as string}
          defaultValue={field.value as string}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage>{fieldState.error?.message}</FormMessage>
    </FormItem>
  );
}
