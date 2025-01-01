import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useClients } from 'src/hooks/useClients';
import { Client } from 'src/types/hooks';
import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { useToast } from 'src/components/ui/use-toast';
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

interface ClientDialogProps {
  client?: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function ClientDialog({ client, open, onOpenChange, onClose }: ClientDialogProps) {
  const supabase = createClientComponentClient()
  const { addClient, updateClient } = useClients()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: uuidv4(),
    full_name: client?.full_name || "",
    company_name: client?.company_name || "",
    contact_email: client?.contact_email || "",
    type: client?.type || "individual",
    status: client?.status || "active",
  })

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.contact_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      toast({
        title: "Validation Error",
        description: "Valid email is required",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('clients')
        .upsert([formData])

      if (error) throw error

      toast({
        title: client ? "Client updated" : "Client added",
        description: client ? "Client updated successfully" : "New client added successfully",
      })
      onClose()
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>
              {client
                ? "Make changes to the client information here."
                : "Add a new client to your practice."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company_name" className="text-right">
                Company
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_email" className="text-right">
                Email
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="non_profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : client ? "Save Changes" : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
