import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TimerSettings } from './types';
import TaskList from './components/TaskList';
import FocusTimer from './components/FocusTimer';
import TaskDialog from './components/TaskDialog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PlusCircle, ListTodo, Calendar, CheckCircle, Moon, Sun, Focus } from 'lucide-react';
import { useHotkeys } from './hooks/useHotkeys';
import IsolationMode from './pages/IsolationMode';
import SequentialMode from './pages/SequentialMode';

type FocusMode = 'default' | 'isolation' | 'sequential';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [activeTab, setActiveTab] = useState<TaskStatus>('today');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [focusMode, setFocusMode] = useState<FocusMode>('default');
  
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const [timerSettings, setTimerSettings] = useLocalStorage<TimerSettings>('timerSettings', {
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    isRunning: false,
    isPaused: false,
    timeRemaining: 25 * 60,
    isBreak: false,
  });

  useHotkeys('n', () => {
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  }, 'Add new task');

  useHotkeys('d', () => setDarkMode(!darkMode), 'Toggle dark mode');
  useHotkeys('1', () => setActiveTab('today'), 'Show today\'s tasks');
  useHotkeys('2', () => setActiveTab('upcoming'), 'Show upcoming tasks');
  useHotkeys('3', () => setActiveTab('completed'), 'Show completed tasks');
  useHotkeys('Escape', () => setFocusMode('default'), 'Exit focus mode');

  useEffect(() => {
    const incompleteTasks = tasks.filter(task => !task.completed).length;
    document.title = incompleteTasks > 0 
      ? `(${incompleteTasks}) InnerMonk - ADHD Task Manager`
      : 'InnerMonk - ADHD Task Manager';
  }, [tasks]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  if (focusMode === 'isolation') {
    return (
      <IsolationMode
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onExit={() => setFocusMode('default')}
        darkMode={darkMode}
        timerSettings={timerSettings}
        onTimerSettingsChange={setTimerSettings}
      />
    );
  }

  if (focusMode === 'sequential') {
    return (
      <SequentialMode
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onExit={() => setFocusMode('default')}
        darkMode={darkMode}
        timerSettings={timerSettings}
        onTimerSettingsChange={setTimerSettings}
      />
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'completed') {
      return task.completed;
    }
    return !task.completed && task.status === activeTab;
  });

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
            status: !task.completed ? 'completed' : 'today',
            subtasks: task.subtasks.map(st => ({ ...st, completed: !task.completed }))
          }
        : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleTaskSave = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, task]);
    }
    setEditingTask(undefined);
    setIsTaskDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                InnerMonk
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFocusMode('isolation')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Focus className="w-5 h-5" />
                  Focus Mode
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full ${
                    darkMode ? 'bg-gray-800 text-yellow-500' : 'bg-gray-200 text-gray-600'
                  }`}
                  aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay focused, organized, and accomplish more
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'today'
                      ? 'bg-blue-500 text-white'
                      : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                  aria-pressed={activeTab === 'today'}
                >
                  <ListTodo className="w-5 h-5" />
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-500 text-white'
                      : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                  aria-pressed={activeTab === 'upcoming'}
                >
                  <Calendar className="w-5 h-5" />
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'completed'
                      ? 'bg-blue-500 text-white'
                      : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                  aria-pressed={activeTab === 'completed'}
                >
                  <CheckCircle className="w-5 h-5" />
                  Completed
                </button>
              </div>

              <TaskList
                tasks={filteredTasks}
                onTaskComplete={handleTaskComplete}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onEditTask={handleEditTask}
                darkMode={darkMode}
              />

              <button
                onClick={() => {
                  setEditingTask(undefined);
                  setIsTaskDialogOpen(true);
                }}
                className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                aria-label="Add new task"
              >
                <PlusCircle className="w-5 h-5" />
                Add New Task (N)
              </button>
            </div>

            <div>
              <FocusTimer
                settings={timerSettings}
                onSettingsChange={setTimerSettings}
                darkMode={darkMode}
                tasks={tasks}
                onEnterIsolation={() => setFocusMode('isolation')}
                onEnterSequential={() => setFocusMode('sequential')}
              />
            </div>
          </div>
        </div>

        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => {
            setIsTaskDialogOpen(false);
            setEditingTask(undefined);
          }}
          onSave={handleTaskSave}
          initialTask={editingTask}
        />
      </div>
    </div>
  );
}

export default App;