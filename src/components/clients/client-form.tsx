'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormProvider } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { DbClient, DbClientContactDetails, TaxInfo } from '@/types/clients'
import { Button } from '@/components/ui/button'

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
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client?.id || '',
      full_name: client?.full_name || '',
      company_name: client?.company_name || '',
      contact_email: client?.contact_email || '',
      status: client?.status || 'pending',
      type: client?.type || 'individual',
      onboarding_notes: client?.onboarding_notes || '',
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
      }
    },
  })

  const handleSubmit = async (data: ClientFormSchema) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Failed to submit client:', error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" />
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
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Company name (if applicable)" />
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
                    <Input {...field} type="email" placeholder="Email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onboarding_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onboarding Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any onboarding notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {isEditing ? 'Update Client' : 'Create Client'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
} 