import React from 'react';
import { Task } from '../../types';
import { Brain, Coffee } from 'lucide-react';

interface DefaultDashboardProps {
  tasks: Task[];
  darkMode: boolean;
  currentTime: number;
  isBreak: boolean;
}

const DefaultDashboard: React.FC<DefaultDashboardProps> = ({
  tasks,
  darkMode,
  currentTime,
  isBreak,
}) => {
  const today = new Date().toDateString();
  
  // Only count today's tasks
  const todaysTasks = tasks.filter(task => task.status === 'today');
  const incompleteTasks = todaysTasks.filter(task => !task.completed);
  const completedToday = tasks.filter(task => 
    task.completed && 
    task.completedAt && 
    new Date(task.completedAt).toDateString() === today
  );

  const progressPercentage = todaysTasks.length > 0 
    ? Math.round((completedToday.length / todaysTasks.length) * 100)
    : 0;

  return (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        {isBreak ? (
          <Coffee className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        ) : (
          <Brain className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        )}
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isBreak ? 'Break Time' : 'Focus Session'}
        </h3>
      </div>

      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="mb-2">
          {completedToday.length} of {todaysTasks.length} tasks completed today ({progressPercentage}%)
        </p>
        <p>
          {incompleteTasks.length} tasks remaining today
        </p>
      </div>
    </div>
  );
};

export default DefaultDashboard;