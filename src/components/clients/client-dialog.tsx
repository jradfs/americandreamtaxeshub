'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { DbClient, ClientWithRelations, ClientFormData } from '@/types/clients'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { clientFormSchema } from '@/lib/validations/client'

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: DbClient | null
  onSubmit: (data: ClientFormData) => Promise<void>
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
}: ClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ClientFormData>({
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

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Create Client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              className={errors.full_name ? 'border-destructive' : ''}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              {...register('contact_email')}
              className={errors.contact_email ? 'border-destructive' : ''}
            />
            {errors.contact_email && (
              <p className="text-sm text-destructive">
                {errors.contact_email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value as any)}
              defaultValue={client?.status || 'pending'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => setValue('type', value as any)}
              defaultValue={client?.type || 'individual'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? client
                  ? 'Updating...'
                  : 'Creating...'
                : client
                ? 'Update'
                : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
