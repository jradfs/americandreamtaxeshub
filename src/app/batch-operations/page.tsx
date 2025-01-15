"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient"

interface SelectedItem {
  type: "client" | "document" | "return"
  id: string | number
}

export default function BatchOperationsPage() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  function addSelectedItem(item: SelectedItem) {
    setSelectedItems((prev) => [...prev, item])
  }

  async function handleDeleteAll() {
    for (const item of selectedItems) {
      // This is a naive approach; real logic will vary
      const table = item.type === "client"
        ? "clients"
        : item.type === "document"
        ? "documents"
        : "tax_returns"
      await supabaseBrowserClient.from(table).delete().eq("id", item.id)
    }
    alert(`Deleted ${selectedItems.length} items.`)
    setSelectedItems([])
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Batch Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select multiple items from different tables and perform bulk actions.
          </p>
          <Button className="mt-2" variant="outline" onClick={handleDeleteAll}>
            Delete Selected
          </Button>
        </CardContent>
      </Card>

      {/* Example placeholders for adding items */}
      <Card>
        <CardHeader>
          <CardTitle>Add Items to Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            onClick={() => addSelectedItem({ type: "client", id: "client-42" })}
          >
            Add Client #42
          </Button>
          <Button
            variant="outline"
            onClick={() => addSelectedItem({ type: "document", id: 99 })}
          >
            Add Document #99
          </Button>
          <Button
            variant="outline"
            onClick={() => addSelectedItem({ type: "return", id: 123 })}
          >
            Add Return #123
          </Button>
        </CardContent>
      </Card>

      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {selectedItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.type}:</strong> {item.id}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 