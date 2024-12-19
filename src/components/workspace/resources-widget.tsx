import { File, Link, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Resource {
  id: string
  name: string
  type: "file" | "link"
  url: string
}

interface ResourcesWidgetProps {
  resources?: Resource[]
  onAddResource?: () => void
}

export function ResourcesWidget({ resources = [], onAddResource }: ResourcesWidgetProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Resources</h3>
        <Button variant="outline" size="sm" onClick={onAddResource}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {resources.length > 0 ? (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
              >
                {resource.type === "file" ? (
                  <File className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                <span className="text-sm truncate">{resource.name}</span>
              </a>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No resources added yet
        </div>
      )}
    </Card>
  )
}