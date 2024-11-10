import React, { useState } from 'react';
import { Task, TimerSettings } from '../types';
import { ArrowLeft, CheckCircle2, Circle, Focus } from 'lucide-react';
import FocusTimer from '../components/FocusTimer';

interface IsolationModeProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onExit: () => void;
  darkMode: boolean;
  timerSettings: TimerSettings;
  onTimerSettingsChange: (settings: TimerSettings) => void;
}

const IsolationMode: React.FC<IsolationModeProps> = ({
  tasks,
  onTaskUpdate,
  onExit,
  darkMode,
  timerSettings,
  onTimerSettingsChange,
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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
        <div className={`max-w-2xl mx-auto rounded-lg p-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center py-8">
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
        </div>
      </div>
    );
  }

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
            <Focus className="w-5 h-5" />
            Isolation Mode
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className={`rounded-lg p-8 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`text-sm mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Task {currentTaskIndex + 1} of {incompleteTasks.length}
              </div>

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
                  <h2 className={`text-2xl font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentTask.title}
                  </h2>
                  {currentTask.description && (
                    <p className={`mt-4 text-lg ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {currentTask.description}
                    </p>
                  )}

                  {currentTask.subtasks.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className={`text-lg font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Steps to Complete:
                      </h3>
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
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                          >
                            {subtask.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
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
                  )}
                </div>
              </div>

              {currentTaskIndex < incompleteTasks.length - 1 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Skip to Next Task
                  </button>
                </div>
              )}
            </div>
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

export default IsolationMode;