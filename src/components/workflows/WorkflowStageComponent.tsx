interface WorkflowStageProps {
  stage: string;
  tasks: string[];
  completedTasks: number;
  totalTasks: number;
}

export function WorkflowStageComponent({
  stage,
  tasks,
  completedTasks,
  totalTasks
}: WorkflowStageProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{stage}</h3>
      <div className="text-sm text-gray-600 mb-2">
        {completedTasks}/{totalTasks} tasks completed
      </div>
      <ul className="space-y-1">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => {}}
            />
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}