'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { DbClient, DbClientContactDetails, TaxInfo } from '@/types/clients'

interface ClientFormProps {
  client?: DbClient & {
    contact_details?: DbClientContactDetails | null
    tax_info?: TaxInfo | null
  } | null
  onSubmit: (data: ClientFormSchema) => Promise<void>
}

export function ClientForm({ client, onSubmit }: ClientFormProps) {
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client?.id || '',
      full_name: client?.full_name || '',
      company_name: client?.company_name || '',
      contact_email: client?.contact_email || '',
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
    <Form form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
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
                    <Input {...field} placeholder="Enter company name" />
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
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter contact email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contact_details.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Enter phone number" />
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
                    <Input {...field} placeholder="Enter street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_details.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
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
                      <Input {...field} placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_details.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ZIP code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tax_info.tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tax ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_info.filing_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter filing status" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_info.tax_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Year</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Enter tax year" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
} 