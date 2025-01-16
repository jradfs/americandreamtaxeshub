"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Plus,
  Clock,
  CalendarClock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProjectTemplates } from "src/hooks/useProjectTemplates";
import { ProjectTemplate } from "src/types/hooks";
import { CreateTemplateDialog } from "./create-template-dialog";
import { TemplateTasks } from "./template-tasks";

export function ProjectTemplateList() {
  const { templates } = useProjectTemplates();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tax-return":
        return "bg-red-500";
      case "bookkeeping":
        return "bg-blue-500";
      case "payroll":
        return "bg-green-500";
      case "business-services":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleTemplate = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Templates</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleTemplate(template.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle>{template.title}</CardTitle>
                    {expandedTemplate === template.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge
                  className={`${getCategoryColor(template.category)} text-white`}
                >
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {template.project_defaults?.estimated_total_minutes && (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {Math.floor(
                        template.project_defaults.estimated_total_minutes / 60,
                      )}
                      h {template.project_defaults.estimated_total_minutes % 60}
                      m
                    </div>
                  )}
                  {template.recurring_schedule && (
                    <div className="flex items-center">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      {template.recurring_schedule}
                    </div>
                  )}
                  {template.default_priority && (
                    <Badge
                      variant={
                        template.default_priority === "high"
                          ? "destructive"
                          : template.default_priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {template.default_priority} priority
                    </Badge>
                  )}
                </div>

                {expandedTemplate === template.id && (
                  <div className="mt-4 pt-4 border-t">
                    <TemplateTasks template={template} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTemplateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
