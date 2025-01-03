'use client';

import type { Project } from "@/types/database.types";
import type { Task } from "@/types/task-management";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TaskList } from "@/components/workspace/task-list";
import { TimeTrackingWidget } from "@/components/workspace/time-tracker";
import { ResourcesWidget } from "@/components/workspace/resources-widget";
import { AssigneesWidget } from "@/components/workspace/assignees-widget";

interface ProjectViewProps {
  project: Project;
  clientTasks: Task[];
  teamTasks: Task[];
  clientName: string;
  onStatusChange?: (status: ProjectStatus) => void;
  onTaskComplete?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskUpdate?: (task: Task) => void;
  onProjectUpdate?: (updates: Partial<Project>) => void;
}

export default function ProjectView({ project, clientTasks, teamTasks, clientName }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Header */}
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <Breadcrumb items={[clientName, project.name]} />
          <div className="flex items-center space-x-2">
            <Button>Email Client</Button>
            <Button>Actions</Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="client-chat">Client Chat</TabsTrigger>
            <TabsTrigger value="team-chat">Team Chat</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
            <TabsTrigger value="emails">Client Emails</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[1fr,300px] gap-4 p-6">
        <div className="space-y-6">
          <TabsContent value="list" className="m-0">
            {/* Client Tasks Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Client Tasks</h2>
                <Button variant="outline" size="sm">Add Task</Button>
              </div>
              <TaskList
                tasks={clientTasks}
                groupBy="status"
                onUpdateTask={() => {}}
                onDeleteTask={() => {}}
              />
            </div>

            {/* Team Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Team Tasks</h2>
                <Button variant="outline" size="sm">Add Task</Button>
              </div>
              <TaskList
                tasks={teamTasks}
                groupBy="status"
                onUpdateTask={() => {}}
                onDeleteTask={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="client-chat">
            <div className="text-center text-muted-foreground">
              Client chat feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="team-chat">
            <div className="text-center text-muted-foreground">
              Team chat feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="text-center text-muted-foreground">
              File management feature coming soon
            </div>
          </TabsContent>

          <TabsContent value="time">
            <div className="text-center text-muted-foreground">
              Time tracking overview coming soon
            </div>
          </TabsContent>

          <TabsContent value="emails">
            <div className="text-center text-muted-foreground">
              Email integration coming soon
            </div>
          </TabsContent>
        </div>

        {/* Right Sidebar */}
        <aside className="border-l p-4">
          <div className="space-y-6">
            <TimeTrackingWidget />
            <ResourcesWidget
              resources={project.resources}
              onAddResource={() => {}}
            />
            <AssigneesWidget
              assignees={project.assignees}
              onAddAssignee={() => {}}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
