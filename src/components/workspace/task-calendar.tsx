'use client';

import { Task } from '@/types/task-management';
import { useState } from 'react';

interface TaskCalendarProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, task: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCalendar = ({ tasks, onUpdateTask, onDeleteTask }: TaskCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get the last day of the month
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Create array of dates for the current month view
  const dates = [];
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();
  
  // Add padding for days from previous month
  for (let i = 0; i < startPadding; i++) {
    dates.push(null);
  }
  
  // Add all days of current month
  for (let i = 1; i <= totalDays; i++) {
    dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              ←
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar dates */}
        {dates.map((date, index) => (
          <div
            key={index}
            className={`min-h-[120px] bg-white p-2 ${
              date && date.getDate() === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear()
                ? 'bg-blue-50'
                : ''
            }`}
          >
            {date && (
              <>
                <div className="font-medium text-sm text-gray-900">
                  {date.getDate()}
                </div>
                <div className="mt-2 space-y-1">
                  {getTasksForDate(date).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded truncate ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCalendar;
