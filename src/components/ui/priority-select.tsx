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

type Priority = Database["public"]["Enums"]["task_priority"];

interface PrioritySelectProps<TFieldValues>
  extends UseControllerProps<TFieldValues> {
  label?: string;
  placeholder?: string;
}

/**
 * Reusable PrioritySelect component
 */
export function PrioritySelect<TFieldValues>({
  name,
  control,
  label = "Priority",
  placeholder = "Select priority",
}: PrioritySelectProps<TFieldValues>) {
  const { field, fieldState } = useController({ name, control });
  const priorityOptions: Priority[] = ["low", "medium", "high", "urgent"];

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
            {priorityOptions.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage>{fieldState.error?.message}</FormMessage>
    </FormItem>
  );
}
