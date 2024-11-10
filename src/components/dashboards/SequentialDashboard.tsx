import React, { useState } from 'react';
import { Task } from '../../types';
import { ArrowLeft, CheckCircle2, Circle, ArrowRight, ArrowDown } from 'lucide-react';

interface SequentialDashboardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  darkMode: boolean;
  onExitMode: () => void;
}

const SequentialDashboard: React.FC<SequentialDashboardProps> = ({
  tasks,
  onTaskUpdate,
  darkMode,
  onExitMode,
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const incompleteTasks = tasks.filter(task => !task.completed);

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
          Exit Sequential Mode
        </button>
      </div>

      <div className="space-y-4">
        {incompleteTasks.map((task, index) => (
          <div
            key={task.id}
            className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } rounded-lg overflow-hidden`}
          >
            <button
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              className={`w-full p-4 flex items-center gap-3 ${
                expandedTask === task.id
                  ? darkMode
                    ? 'bg-gray-600'
                    : 'bg-gray-100'
                  : ''
              }`}
            >
              <div className="flex-1 flex items-center gap-3">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {index + 1}
                </span>
                <span className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {task.title}
                </span>
              </div>
              {expandedTask === task.id ? (
                <ArrowDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedTask === task.id && (
              <div className="p-4 border-t border-gray-600">
                {task.description && (
                  <p className={`mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {task.description}
                  </p>
                )}

                <div className="space-y-2">
                  {task.subtasks.map(subtask => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3"
                    >
                      <button
                        onClick={() => {
                          onTaskUpdate({
                            ...task,
                            subtasks: task.subtasks.map(st =>
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

                <button
                  onClick={() => onTaskUpdate({
                    ...task,
                    completed: !task.completed,
                  })}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Mark Task Complete
                </button>
              </div>
            )}
          </div>
        ))}

        {incompleteTasks.length === 0 && (
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
        )}
      </div>
    </div>
  );
};

export default SequentialDashboard;