"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient"
import { Database } from "@/types/database.types"

type Client = Database["public"]["Tables"]["clients"]["Row"]
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"]
type TaxReturn = Database["public"]["Tables"]["tax_returns"]["Row"]

export default function SearchPage() {
  const [keyword, setKeyword] = useState("")
  const [searchResults, setSearchResults] = useState<
    { type: string; name: string; id: string }[]
  >([])

  async function handleSearch() {
    // Searching clients by full_name
    const clientsPromise = supabaseBrowserClient
      .from("clients")
      .select("id, full_name")
      .ilike("full_name", `%${keyword}%`)

    // Searching documents by file_name
    const docsPromise = supabaseBrowserClient
      .from("documents")
      .select("id, file_name")
      .ilike("file_name", `%${keyword}%`)

    // Searching tax_returns by name
    const returnsPromise = supabaseBrowserClient
      .from("tax_returns")
      .select("id, name")
      .ilike("name", `%${keyword}%`)

    const [clientRes, docRes, returnRes] = await Promise.all([
      clientsPromise,
      docsPromise,
      returnsPromise,
    ])

    const results: { type: string; name: string; id: string }[] = []

    if (clientRes.data) {
      for (let c of clientRes.data) {
        results.push({ type: "Client", name: c.full_name, id: c.id })
      }
    }
    if (docRes.data) {
      for (let d of docRes.data) {
        results.push({ type: "Document", name: d.file_name, id: d.id.toString() })
      }
    }
    if (returnRes.data) {
      for (let r of returnRes.data) {
        results.push({ type: "Tax Return", name: r.name, id: r.id.toString() })
      }
    }
    setSearchResults(results)
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Advanced Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results found.</p>
          ) : (
            <ul className="space-y-1">
              {searchResults.map((res, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>
                    <strong>{res.type}:</strong> {res.name}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 