"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database.types";

type TaxReturn = Database["public"]["Tables"]["tax_returns"]["Row"];

const taxReturnSchema = z.object({
  tax_year: z
    .number()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  status: z.enum(["draft", "in_progress", "review", "completed"]),
  client_id: z.string().uuid(),
  due_date: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
});

type FormValues = z.infer<typeof taxReturnSchema>;

function getTaxYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

interface TaxReturnFormProps {
  clientId: string;
  initialData?: Partial<TaxReturn>;
}

export function TaxReturnForm({ clientId, initialData }: TaxReturnFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(taxReturnSchema),
    defaultValues: {
      tax_year: initialData?.tax_year || new Date().getFullYear(),
      status: (initialData?.status as FormValues["status"]) || "draft",
      client_id: clientId,
      due_date: initialData?.due_date,
      assigned_to: initialData?.assigned_to,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = initialData?.id
        ? await supabase
            .from("tax_returns")
            .update(values)
            .eq("id", initialData.id)
        : await supabase.from("tax_returns").insert(values);

      if (error) throw error;

      router.refresh();
      router.push(`/dashboard/tax-returns`);
    } catch (error) {
      console.error("Error saving tax return:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tax_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Year</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getTaxYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Update" : "Create"} Tax Return
        </Button>
      </form>
    </Form>
  );
}
