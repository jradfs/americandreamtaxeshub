'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { clientFormSchema, type ClientFormSchema } from '@/lib/validations/client'
import { DbClient } from '@/types/clients'

interface ClientFormProps {
  client?: DbClient | null
  onSubmit: (data: ClientFormSchema) => Promise<void>
}

export function ClientForm({ client, onSubmit }: ClientFormProps) {
  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: client?.id || '',
      full_name: client?.full_name || '',
      email: client?.email || '',
      contact_email: client?.contact_email || '',
      status: client?.status || 'pending',
      type: client?.type || 'individual',
      contact_info: client?.contact_info ? JSON.parse(JSON.stringify(client.contact_info)) : null,
      tax_info: client?.tax_info ? JSON.parse(JSON.stringify(client.tax_info)) : null,
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email" />
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
      </form>
    </Form>
  )
} 