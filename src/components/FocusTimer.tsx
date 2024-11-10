import React, { useEffect } from 'react';
import { TimerSettings, Task } from '../types';
import { Timer, Focus, ListTodo, Trophy, Target } from 'lucide-react';
import DefaultDashboard from './dashboards/DefaultDashboard';
import confetti from 'canvas-confetti';

interface FocusTimerProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  darkMode: boolean;
  minimal?: boolean;
  tasks?: Task[];
  onEnterIsolation?: () => void;
  onEnterSequential?: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({
  settings,
  onSettingsChange,
  darkMode,
  minimal = false,
  tasks = [],
  onEnterIsolation,
  onEnterSequential,
}) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (settings.isRunning && !settings.isPaused && settings.timeRemaining > 0) {
      interval = setInterval(() => {
        onSettingsChange({
          ...settings,
          timeRemaining: settings.timeRemaining - 1,
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [settings, onSettingsChange]);

  useEffect(() => {
    if (settings.timeRemaining === 0) {
      // Celebrate session completion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSettingsChange({
        ...settings,
        isRunning: false,
        isPaused: false,
        timeRemaining: settings.isBreak ? settings.workDuration : settings.breakDuration,
        isBreak: !settings.isBreak,
      });
    }
  }, [settings.timeRemaining, onSettingsChange, settings]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerBackground = () => {
    if (settings.isBreak) {
      return darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50';
    }
    return darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50';
  };

  const getTimerBorder = () => {
    if (settings.isBreak) {
      return darkMode ? 'border-emerald-500/30' : 'border-emerald-200';
    }
    return darkMode ? 'border-indigo-500/30' : 'border-indigo-200';
  };

  const getTimerText = () => {
    if (settings.isBreak) {
      return darkMode ? 'text-emerald-300' : 'text-emerald-700';
    }
    return darkMode ? 'text-indigo-300' : 'text-indigo-700';
  };

  const calculateProgress = () => {
    const totalTime = settings.isBreak ? settings.breakDuration : settings.workDuration;
    return ((totalTime - settings.timeRemaining) / totalTime) * 100;
  };

  // Calculate daily progress based on today's tasks only
  const today = new Date().toDateString();
  const todaysTasks = tasks?.filter(task => task.status === 'today') || [];
  const completedToday = tasks?.filter(task => 
    task.completed && 
    task.completedAt && 
    new Date(task.completedAt).toDateString() === today
  ) || [];

  const taskProgress = todaysTasks.length > 0 
    ? (completedToday.length / todaysTasks.length) * 100 
    : 0;

  return (
    <div className={`rounded-xl border-2 ${getTimerBorder()} ${getTimerBackground()} p-6 sticky top-8 shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${getTimerText()}`}>
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6" />
            {settings.isBreak ? 'Break Time' : 'Focus Session'}
          </div>
        </h2>
      </div>

      <div className="space-y-6">
        {!minimal && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onEnterIsolation}
                className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${
                  darkMode
                    ? 'bg-violet-900/20 border-violet-700/30 hover:bg-violet-900/30 hover:border-violet-600/50'
                    : 'bg-violet-50 border-violet-200 hover:bg-violet-100 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Focus className={darkMode ? 'text-violet-300' : 'text-violet-600'} />
                  <span className={`font-bold ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
                    Isolation Mode
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-violet-300/70' : 'text-violet-600/80'}`}>
                  Focus on one task at a time
                </p>
              </button>

              <button
                onClick={onEnterSequential}
                className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${
                  darkMode
                    ? 'bg-fuchsia-900/20 border-fuchsia-700/30 hover:bg-fuchsia-900/30 hover:border-fuchsia-600/50'
                    : 'bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100 hover:border-fuchsia-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className={darkMode ? 'text-fuchsia-300' : 'text-fuchsia-600'} />
                  <span className={`font-bold ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-700'}`}>
                    Sequential Mode
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-fuchsia-300/70' : 'text-fuchsia-600/80'}`}>
                  Work through tasks step by step
                </p>
              </button>
            </div>

            <DefaultDashboard
              tasks={tasks}
              darkMode={darkMode}
              currentTime={settings.timeRemaining}
              isBreak={settings.isBreak}
            />
          </>
        )}

        <div className={`p-6 rounded-lg ${settings.isBreak ? 'bg-emerald-900/20' : 'bg-indigo-900/20'} text-center`}>
          <div className={`text-5xl font-bold mb-4 ${getTimerText()} font-mono tracking-wider`}>
            {formatTime(settings.timeRemaining)}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSettingsChange({
                ...settings,
                isRunning: !settings.isRunning,
                isPaused: !settings.isRunning ? false : settings.isPaused,
              })}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                settings.isRunning
                  ? darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : settings.isBreak
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {settings.isRunning ? 'Pause' : 'Start'}
            </button>

            <button
              onClick={() => onSettingsChange({
                ...settings,
                timeRemaining: settings.isBreak ? settings.workDuration : settings.breakDuration,
                isBreak: !settings.isBreak,
                isRunning: false,
                isPaused: false,
              })}
              className={`px-6 py-2 rounded-lg font-semibold ${
                settings.isBreak
                  ? darkMode
                    ? 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/40'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : darkMode
                  ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              } transition-all duration-200`}
            >
              Switch to {settings.isBreak ? 'Focus' : 'Break'}
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-4">
          {/* Session Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`w-4 h-4 ${getTimerText()}`} />
                <span className={`text-sm font-medium ${getTimerText()}`}>
                  Session Progress
                </span>
              </div>
              <span className={`text-sm ${getTimerText()}`}>
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  settings.isBreak
                    ? 'bg-emerald-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          {/* Daily Task Progress */}
          {!minimal && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${getTimerText()}`} />
                  <span className={`text-sm font-medium ${getTimerText()}`}>
                    Daily Progress
                  </span>
                </div>
                <span className={`text-sm ${getTimerText()}`}>
                  {completedToday.length} of {todaysTasks.length} tasks
                </span>
              </div>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    settings.isBreak
                      ? 'bg-emerald-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;