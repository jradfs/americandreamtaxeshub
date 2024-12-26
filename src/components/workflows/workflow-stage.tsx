import { Tables } from '@/types/database.types';
import TaskCard from '../tasks/task-card';

interface WorkflowStageProps {
  stageName: string;
  tasks: Tables<'tasks'>[];
}

export default function WorkflowStage({ stageName, tasks }: WorkflowStageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{stageName}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}