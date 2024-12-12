'use client'

import { ClientList } from "@/components/clients/client-list"
import { Toaster } from "@/components/ui/toaster"

export default function ClientsPage() {
  return (
    <div className="container py-10">
      <ClientList />
      <Toaster />
    </div>
  )
}
