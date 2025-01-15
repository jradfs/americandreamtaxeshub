import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const columns = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function TasksPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <Card key={col.id} className="space-y-2">
          <CardHeader>
            <CardTitle>{col.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Placeholder tasks */}
              <div className="p-3 border rounded hover:bg-muted transition-colors">
                <span className="font-medium">Task #1</span>
              </div>
              <div className="p-3 border rounded hover:bg-muted transition-colors">
                <span className="font-medium">Task #2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}