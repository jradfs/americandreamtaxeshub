import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Assignee {
  id: string
  name: string
  email: string
  avatar_url?: string
  role?: string
}

interface AssigneesWidgetProps {
  assignees?: Assignee[]
  onAddAssignee?: () => void
}

export function AssigneesWidget({ assignees = [], onAddAssignee }: AssigneesWidgetProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Assignees</h3>
        </div>
        <Button variant="outline" size="sm" onClick={onAddAssignee}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {assignees.length > 0 ? (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={assignee.avatar_url} alt={assignee.name} />
                    <AvatarFallback>
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{assignee.name}</div>
                    {assignee.role && (
                      <div className="text-xs text-muted-foreground">{assignee.role}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No assignees yet
        </div>
      )}
    </Card>
  )
}