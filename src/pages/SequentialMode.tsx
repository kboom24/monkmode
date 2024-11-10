import React, { useState } from 'react';
import { Task, TimerSettings } from '../types';
import { ArrowLeft, CheckCircle2, Circle, ArrowRight, ArrowDown, ListTodo } from 'lucide-react';
import FocusTimer from '../components/FocusTimer';

interface SequentialModeProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onExit: () => void;
  darkMode: boolean;
  timerSettings: TimerSettings;
  onTimerSettingsChange: (settings: TimerSettings) => void;
}

const SequentialMode: React.FC<SequentialModeProps> = ({
  tasks,
  onTaskUpdate,
  onExit,
  darkMode,
  timerSettings,
  onTimerSettingsChange,
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onExit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Focus Mode
          </button>
          <div className={`flex items-center gap-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <ListTodo className="w-5 h-5" />
            Sequential Mode
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {incompleteTasks.length > 0 ? (
              <div className="space-y-4">
                {incompleteTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`rounded-lg overflow-hidden ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className={`w-full p-6 flex items-center gap-3 ${
                        expandedTask === task.id
                          ? darkMode
                            ? 'bg-gray-700'
                            : 'bg-gray-50'
                          : ''
                      }`}
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <span className={`flex items-center justify-center w-8 h-8 text-lg rounded-full ${
                          darkMode ? 'bg-gray-900' : 'bg-gray-100'
                        } ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                        <span className={`text-xl font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </span>
                      </div>
                      {expandedTask === task.id ? (
                        <ArrowDown className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      )}
                    </button>

                    {expandedTask === task.id && (
                      <div className="p-6 border-t border-gray-700">
                        {task.description && (
                          <p className={`mb-6 text-lg ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {task.description}
                          </p>
                        )}

                        <div className="space-y-4">
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
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                              >
                                {subtask.completed ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                              <span className={`text-lg ${subtask.completed
                                ? 'line-through text-gray-400'
                                : darkMode
                                ? 'text-gray-300'
                                : 'text-gray-700'
                              }`}>
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
                          className={`mt-6 px-6 py-3 rounded-lg ${
                            darkMode
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          Mark Task Complete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-lg p-8 text-center ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-2xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  All Tasks Completed! 🎉
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Great job! You've completed all your tasks. Take a moment to celebrate your accomplishment.
                </p>
                <button
                  onClick={onExit}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>

          <div>
            <FocusTimer
              settings={timerSettings}
              onSettingsChange={onTimerSettingsChange}
              darkMode={darkMode}
              minimal
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequentialMode;