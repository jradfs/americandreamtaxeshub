'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { DbClient, DbClientContactDetails, TaxInfo } from '@/types/clients'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface ClientFormProps {
  client?: DbClient & {
    contact_details?: DbClientContactDetails | null
    tax_info?: TaxInfo | null
  } | null
  onSubmit: (data: ClientFormSchema) => Promise<void>
  defaultValues?: Partial<ClientFormSchema>
  isEditing?: boolean
}

export function ClientForm({ client, onSubmit, defaultValues, isEditing = false }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      full_name: client?.full_name || '',
      company_name: client?.company_name || '',
      contact_email: client?.contact_email || '',
      onboarding_notes: client?.onboarding_notes || '',
      status: client?.status || 'pending',
      type: client?.type || 'individual',
      contact_details: client?.contact_details || {
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      },
      tax_info: client?.tax_info || {
        filing_status: '',
        tax_id: '',
        tax_year: new Date().getFullYear(),
        filing_type: null,
        tax_id_type: null,
        dependents: [],
        previous_returns: []
      },
      service_config: client?.service_config || {
        tax_preparation: null,
        bookkeeping: null,
        payroll: null,
        advisory: null
      },
      onboarding_progress: client?.onboarding_progress || {
        status: 'pending',
        completed_steps: [],
        next_steps: [],
        documents_received: []
      },
      document_requirements: client?.document_requirements || []
      }
    },
  })

  const handleSubmit = async (data: ClientFormSchema) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      form.reset()
      toast({
        title: 'Success',
        description: isEditing ? 'Client updated successfully' : 'Client created successfully'
      })
    } catch (error) {
      console.error('Failed to submit client:', error)
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update client' : 'Failed to create client',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Company name (if applicable)" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email address" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_details.phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Phone number" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contact_details.address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street address" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_details.city"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City" aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_details.state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="State" aria-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_details.zip"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ZIP code" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="service_config"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Services Required</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Specify required services" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="onboarding_notes"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Onboarding Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any onboarding notes" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onboarding_progress.status"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Onboarding Status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Current onboarding status" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_requirements"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Required Documents</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="List required documents" aria-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Client'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 