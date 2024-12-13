import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, Status } from '@/types/task-management';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask?: (task: Task) => void;
}

const statusColumns: { id: Status; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-400' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-400' },
  { id: 'done', label: 'Done', color: 'bg-green-400' }
];

export default function KanbanBoard({ tasks, onUpdateTask, onEditTask }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside the list or no change
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Update task status
    const newStatus = destination.droppableId as Status;
    onUpdateTask(draggableId, {
      status: newStatus,
      updated_at: new Date().toISOString()
    });
  };

  const getTasksByStatus = (status: Status): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4 h-full">
        {statusColumns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex flex-col gap-2 p-3 rounded-lg",
                  snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/20"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-2 h-2 rounded-full', column.color)} />
                  <h3 className="font-medium">{column.label}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            'hover:border-blue-500 transition-colors',
                            snapshot.isDragging ? 'rotate-2 shadow-lg' : '',
                            onEditTask && 'cursor-pointer'
                          )}
                          onClick={() => onEditTask?.(task)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              <div
                                className={cn(
                                  'w-2 h-2 rounded-full mt-1 flex-shrink-0',
                                  getPriorityColor(task.priority)
                                )}
                              />
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              {task.due_date && (
                                <span>
                                  Due: {format(new Date(task.due_date), 'MMM d')}
                                </span>
                              )}
                              {task.progress > 0 && (
                                <Badge variant="secondary">
                                  {task.progress}% complete
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
