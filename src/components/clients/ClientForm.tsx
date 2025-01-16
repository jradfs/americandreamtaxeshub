"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientFormSchema,
  type ClientFormSchema,
} from "@/lib/validations/client";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
  initialData?: Partial<ClientFormSchema>;
  clientId?: string;
  onSuccess?: () => void;
}

export function ClientForm({
  initialData,
  clientId,
  onSuccess,
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addClient, updateClient } = useClients();

  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      contact_email: initialData?.contact_email || "",
      company_name: initialData?.company_name || "",
      onboarding_notes: initialData?.onboarding_notes || "",
      status: initialData?.status || "pending",
      type: initialData?.type || "individual",
      contact_details: initialData?.contact_details || {
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      },
      tax_info: initialData?.tax_info || {
        filing_status: "",
        tax_id: "",
        tax_year: undefined,
        filing_type: "",
        tax_id_type: "",
        dependents: [],
        previous_returns: [],
      },
      service_config: initialData?.service_config || {
        tax_preparation: null,
        bookkeeping: null,
        payroll: null,
        advisory: null,
      },
      document_requirements: initialData?.document_requirements || [],
      onboarding_progress: initialData?.onboarding_progress || {
        status: "pending",
        completed_steps: [],
        next_steps: [],
        documents_received: [],
      },
    },
  });

  async function onSubmit(data: ClientFormSchema) {
    try {
      setIsSubmitting(true);
      if (clientId) {
        await updateClient(clientId, data);
      } else {
        await addClient(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_details.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_details.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contact_details.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_details.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_details.zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="ZIP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="onboarding_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onboarding Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {clientId ? "Update Client" : "Add Client"}
        </Button>
      </form>
    </Form>
  );
}
