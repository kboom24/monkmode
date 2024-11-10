import React, { useState } from 'react';
import { Task } from '../../types';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

interface IsolationDashboardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  darkMode: boolean;
  onExitMode: () => void;
}

const IsolationDashboard: React.FC<IsolationDashboardProps> = ({
  tasks,
  onTaskUpdate,
  darkMode,
  onExitMode,
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const incompleteTasks = tasks.filter(task => !task.completed);
  const currentTask = incompleteTasks[currentTaskIndex];

  const handleNext = () => {
    if (currentTaskIndex < incompleteTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  if (!currentTask) {
    return (
      <div className={`rounded-lg shadow-sm p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center py-8">
          <h3 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            All Tasks Completed!
          </h3>
          <button
            onClick={onExitMode}
            className="text-blue-500 hover:text-blue-600"
          >
            Return to Standard Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-sm p-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExitMode}
          className={`flex items-center gap-2 ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Isolation Mode
        </button>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Task {currentTaskIndex + 1} of {incompleteTasks.length}
        </span>
      </div>

      <div className={`p-6 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className="flex items-start gap-4">
          <button
            onClick={() => {
              onTaskUpdate({
                ...currentTask,
                completed: !currentTask.completed,
              });
              handleNext();
            }}
            className="mt-1"
          >
            {currentTask.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentTask.title}
            </h3>
            {currentTask.description && (
              <p className={`mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentTask.description}
              </p>
            )}

            {currentTask.subtasks.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className={`font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Steps to Complete:
                </h4>
                {currentTask.subtasks.map(subtask => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={() => {
                        onTaskUpdate({
                          ...currentTask,
                          subtasks: currentTask.subtasks.map(st =>
                            st.id === subtask.id
                              ? { ...st, completed: !st.completed }
                              : st
                          ),
                        });
                      }}
                    >
                      {subtask.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <span className={subtask.completed
                      ? 'line-through text-gray-400'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-700'
                    }>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {currentTaskIndex < incompleteTasks.length - 1 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Skip to Next Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsolationDashboard;