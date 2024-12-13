'use client';

import { Task } from '@/types/task-management';
import { DragEvent, useState } from 'react';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, task: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusColumns = ['todo', 'in_progress', 'done'] as const;

const TaskBoard = ({ tasks, onUpdateTask, onDeleteTask }: TaskBoardProps) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: typeof statusColumns[number]) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    const taskId = draggedTask;
    if (taskId) {
      onUpdateTask(taskId, { status });
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: typeof statusColumns[number]) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {statusColumns.map(status => (
        <div
          key={status}
          className="bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
            {status.replace('_', ' ')}
          </h3>
          <div className="space-y-3">
            {getTasksByStatus(status).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateTask(task.id, {})}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
