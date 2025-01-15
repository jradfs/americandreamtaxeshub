import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxReturnList } from '@/components/tax/TaxReturnList'
import { DocumentUpload } from '@/components/tax/DocumentUpload'

export default async function TaxReturnsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Tax Returns</h3>
          <p className="text-sm text-muted-foreground">
            Manage and process tax returns for your clients.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Tax Return
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload tax documents for processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload taxReturnId="new" />
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Returns</CardTitle>
              <CardDescription>
                Tax returns currently being processed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxReturnList clientId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Returns</CardTitle>
              <CardDescription>
                Successfully processed tax returns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxReturnList clientId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archived Returns</CardTitle>
              <CardDescription>
                Historical tax returns from previous years.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxReturnList clientId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 