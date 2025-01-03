'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Client } from '@/types/projects';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectList from "@/components/projects/project-list";
import TaskList from "@/components/workspace/task-list";
import { useTasks } from "@/hooks/useTasks";
import { 
  Mail, 
  MessageSquare, 
  Activity, 
  FileText, 
  Lock, 
  DollarSign, 
  ClipboardList,
  FileBox
} from "lucide-react";

interface ClientDetailsProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    type?: string;
    formation_date?: string;
    year_end?: string;
    resources?: Array<{ id: string; name: string; url: string; type: string }>;
  };
}

export function ClientDetails({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single()

        if (error) throw error
        setClient(data)
      } catch (error) {
        console.error('Error fetching client:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId, supabase])

  const { tasks, updateTask, deleteTask } = useTasks({
    clientId: client?.id || '',
    assignedUserId: undefined
  });

  if (loading) return <div>Loading client details...</div>
  if (!client) return <div>Client not found</div>

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <div className="flex items-center space-x-2">
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Email Client
            </Button>
            <Button variant="outline">Actions</Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Client Chat
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="vault">
              <Lock className="h-4 w-4 mr-2" />
              Client Vault
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <DollarSign className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="tasks">
              <ClipboardList className="h-4 w-4 mr-2" />
              Client Tasks Report
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 grid grid-cols-[1fr,300px] gap-4 p-6">
        <div className="space-y-6">
          <TabsContent value="dashboard" className="m-0">
            {/* Projects Section */}
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Projects</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <ProjectList clientId={client.id} />
            </Card>

            {/* Client Notes */}
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notes</h2>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
              <div className="text-sm text-muted-foreground">
                No notes found for this client
              </div>
            </Card>

            {/* Recent Documents */}
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Documents</h2>
                <Button variant="outline" size="sm">Upload</Button>
              </div>
              <div className="text-sm text-muted-foreground">
                No documents found
              </div>
            </Card>

            {/* Client Tasks */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Button variant="outline" size="sm">Add Task</Button>
              </div>
              <TaskList
                tasks={tasks}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <div className="text-center text-muted-foreground py-8">
              Email integration coming soon
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="text-center text-muted-foreground py-8">
              Chat feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center text-muted-foreground py-8">
              Activity tracking coming soon
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="text-center text-muted-foreground py-8">
              Notes feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="text-center text-muted-foreground py-8">
              File management coming soon
            </div>
          </TabsContent>

          <TabsContent value="vault">
            <div className="text-center text-muted-foreground py-8">
              Client vault coming soon
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="text-center text-muted-foreground py-8">
              Transactions feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="text-center text-muted-foreground py-8">
              Billing feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="text-center text-muted-foreground py-8">
              Task reporting coming soon
            </div>
          </TabsContent>
        </div>

        <aside className="space-y-6">
          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Email</div>
                <div>{client.email}</div>
              </div>
              {client.phone && (
                <div>
                  <div className="text-muted-foreground">Phone</div>
                  <div>{client.phone}</div>
                </div>
              )}
              {client.address && (
                <div>
                  <div className="text-muted-foreground">Address</div>
                  <div>{client.address}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Entity Details */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">About</h3>
            <div className="space-y-2 text-sm">
              {client.type && (
                <div>
                  <div className="text-muted-foreground">Entity Type</div>
                  <div>{client.type}</div>
                </div>
              )}
              {client.formation_date && (
                <div>
                  <div className="text-muted-foreground">Formation Date</div>
                  <div>{client.formation_date}</div>
                </div>
              )}
              {client.year_end && (
                <div>
                  <div className="text-muted-foreground">Year End</div>
                  <div>{client.year_end}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Resources */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Resources</h3>
              <Button variant="outline" size="sm">Add</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              No resources added yet
            </div>
          </Card>

          {/* Integrations */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Integrations</h3>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              No integrations connected
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
