import React from 'react';
import { Task } from '../types';
import { X, Focus, CheckCircle2, Circle } from 'lucide-react';
import TaskBreakdown from './TaskBreakdown';

interface TaskIsolationProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedTask: Task | null;
  onTaskSelect: (task: Task | null) => void;
  onTaskUpdate: (task: Task) => void;
  darkMode: boolean;
}

const TaskIsolation: React.FC<TaskIsolationProps> = ({
  isOpen,
  onClose,
  tasks,
  selectedTask,
  onTaskSelect,
  onTaskUpdate,
  darkMode,
}) => {
  if (!isOpen) return null;

  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`relative rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="sticky top-0 p-6 border-b border-gray-200 bg-inherit rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Focus className="w-6 h-6 text-blue-500" />
              Task Isolation Mode
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a task to focus on. All other distractions will be minimized.
          </p>
        </div>

        <div className="p-6">
          {selectedTask ? (
            <TaskBreakdown
              task={selectedTask}
              onTaskUpdate={onTaskUpdate}
              onBack={() => onTaskSelect(null)}
              darkMode={darkMode}
            />
          ) : (
            <div className="space-y-4">
              {incompleteTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => onTaskSelect(task)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 mt-1" />
                    )}
                    <div>
                      <h3 className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`mt-1 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      {task.subtasks.length > 0 && (
                        <div className={`mt-2 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} subtasks completed
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskIsolation;